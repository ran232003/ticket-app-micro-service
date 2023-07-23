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
import { MyError } from "@ranmicroserviceapp/common";
const port = 4001;

const start = async () => {
  //we will put the clusterIp
  try {
    console.log(process.env.JWT_KEY, process.env.MONGO_URI);
    if (!process.env.MONGO_URI) {
      throw new MyError("MONGO_URI error", 500);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to MONGO12");
  } catch (error) {
    console.log("in error", error);
  }
  app.listen(port, () => {
    console.log("hello there");
    console.log(`Example app listening on port ${port}`);
  });
};
console.log("changes123222");
start();
