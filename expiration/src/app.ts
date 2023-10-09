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
import { MyError } from "@ranmicroserviceapp/common";
import crypto from "crypto";
import { natsWrraper } from "./nats-wrapper"; //
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const port = 4003;
const id = crypto.randomBytes(4).toString("hex");

const start = async () => {
  //we will put the clusterIp
  try {
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

      process.env.NATS_URL, //http://nats-srv:4222
      process.env.CLUSTER_ID_NATS, //tickets
      process.env.NATS_CLIENT_ID, //pod name//
      process.env.REDIS_HOST
    );
    //

    //ticketing=>  from infra nats config
    //clientId=>random id
    //clusterId=>the url we will connect to, so the service for nats in infra config:
    //http://nats-srv:4222
    await natsWrraper.connect(
      process.env.CLUSTER_ID_NATS,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrraper.getClient().on("close", () => {
      console.log("NATS close!"); //
      process.exit();
    });
    new OrderCreatedListener(natsWrraper.getClient()).listen();
  } catch (error) {
    console.log("in error", error); //
  }
};
console.log("changes123");
start();
