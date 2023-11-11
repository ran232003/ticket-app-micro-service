// import express from "express";
// import { json } from "body-parser";
// import { userRouter } from "./routes/user-route";
// import { MyError } from "./models/MyError";
// import cookieSession from "cookie-session";
// const app = express();
// //when we are using ingress ngnx
// app.set("trust proxy", true);

// app.use(json());
// app.use(
//   cookieSession({
//     signed: false,
//     secure: true,
//   })
// );
// const port = 4000;

// app.use("/api/user", userRouter);
// app.get("/api/user2", (req, res) => {
//   return res.json({ status: "ok old" });
// });
// app.use((req: any, res: any, next: any) => {
//   console.log("error generic2");
//   const e = new MyError("SOMTHING WENT WRONG", 500);
//   //res.status(errorCode);
//   //res.status(500).send("Something broke!");
//   next(e);
// });
// app.use((error: MyError, req: any, res: any, next: any) => {
//   console.log("error controller22", error);
//   const errorCode = error.code || 500;
//   const errorMsg = error.msg || "unknown error occurd";
//   //res.status(errorCode);
//   //res.status(500).send("Something broke!");
//   res.status(errorCode).json({ status: "fail", message: error.msg });
// });
import mongoose from "mongoose";
import { app } from "./index";
// import { MyError } from "@ranmicroserviceapp/common";
import { MyError, OrderStatus } from "@ranmicroserviceapp/common";
import crypto from "crypto";
import { natsWrraper } from "./nats-wrapper";
import Order from "./models/order-schema";
import { TicketCreatedListener } from "./events/listener/ticket-created-listener";
import { TicketUpdateListener } from "./events/listener/ticket-updated-listener";
import Expiration from "./models/expiration-schema";
import { OrderCancelledPublisher } from "./events/publisher/order-cancelled-publisher";
import { PaymentCreatedListener } from "./events/listener/payment-created-listener";

const port = 4002;
const id = crypto.randomBytes(4).toString("hex"); //

const start = async () => {
  //we will put the clusterIp
  try {
    if (!process.env.MONGO_URI) {
      throw new MyError("MONGO_URI error", 500);
    }
    if (!process.env.CLUSTER_ID_NATS) {
      throw new MyError("CLUSTER_ID_NATS error", 500);
    }
    if (!process.env.NATS_CLIENT_ID) {
      throw new MyError("NATS_CLIENT_ID error", 500);
    }
    if (!process.env.NATS_URL) {
      throw new MyError("NATS_URL", 500);
    }
    console.log(
      "test:",
      process.env.JWT_KEY,
      process.env.MONGO_URI,
      process.env.NATS_URL, //http://nats-srv:4222
      process.env.CLUSTER_ID_NATS, //orders
      process.env.NATS_CLIENT_ID //pod name
    );
    //
    await mongoose.connect(process.env.MONGO_URI);
    //ticketing=>  from infra nats config
    //clientId=>random id
    //clusterId=>the url we will connect to, so the service for nats in infra config:
    //http://nats-srv:4222//
    await natsWrraper.connect(
      process.env.CLUSTER_ID_NATS,
      process.env.NATS_CLIENT_ID, ////
      process.env.NATS_URL
    );
    natsWrraper.getClient().on("close", () => {
      //
      console.log("NATS close!");
      process.exit();
    });
    console.log("connected to MONGO12");
    new TicketCreatedListener(natsWrraper.getClient()).listen();
    new TicketUpdateListener(natsWrraper.getClient()).listen();
    new PaymentCreatedListener(natsWrraper.getClient()).listen();
  } catch (error) {
    console.log("in error", error);
  }
  app.listen(port, () => {
    console.log("hello there");
    console.log(`Example app listening on port ${port}`);
  }); //
};
console.log("changes123");
start();
const checkDatabase = async () => {
  console.log("interval");
  const update = { status: OrderStatus.Cancelled };
  try {
    const currentTime = new Date();
    const results = await Order.updateMany({
      expireAt: { $lt: currentTime },
      update,
    });
    console.log(results);
  } catch (error) {
    console.log(error);
  }
};

async function expireService() {
  // Your code to be executed every minute goes here

  const expireArray = await Expiration.find();
  const now = new Date();
  if (!expireArray) {
    return;
  }
  expireArray.map(async (exp) => {
    if (exp.status === "New" && exp.expireAt < now) {
      console.log("publish expire event, cancel order", exp, now);
      //publish expire event
      const order = await Order.findById(exp.orderId);
      if (!order) {
        throw new MyError("no order found", 500);
      }
      if (order.status !== OrderStatus.Complete) {
        //cancelled order and publish
        order.status = OrderStatus.Cancelled;
        order.version = order.version + 1;
        await order.save();
        console.log("before publish");
        await new OrderCancelledPublisher(natsWrraper.getClient()).publish({
          id: order._id.toString(), //
          userId: order.userId,
          version: order.version,
          ticket: {
            ticketId: order.ticket._id.toString(),
          },
        });
      }
      exp.status = "Expire";
      await exp.save();
    }
  });
}
//const interval = setInterval(checkDatabase, 60000);
const interval = 60000; // 1 minute in milliseconds
setInterval(expireService, interval);
