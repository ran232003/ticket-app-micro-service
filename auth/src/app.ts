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
const port = 4000;

const start = async () => {
  //we will put the clusterIp
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("connected to MONGO1");
  } catch (error) {
    console.log(error);
  }
  app.listen(port, () => {
    console.log("hello there");
    console.log(`Example app listening on port ${port}`);
  });
};
console.log("changes1232");
start();
