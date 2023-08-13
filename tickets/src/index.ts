import express from "express";
import { json } from "body-parser";
import { MyError } from "./models/MyError";
import cookieSession from "cookie-session";
import mongoose from "mongoose";
import { ticketRouter } from "./routes/ticket-routes";
const app = express();
//when we are using ingress ngnx
app.set("trust proxy", true);

app.use(json());
//send coockie only if https request is coming
//when running jest the request are http
//so when env is test we will set up to http
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
console.log(process.env.NODE_ENV, process.env.MONGO_URI, "asd");
const port = 4001;

app.use("/api/tickets", ticketRouter);
app.use((req: any, res: any, next: any) => {
  console.log("error generic2");
  const e = new MyError("SOMTHING WENT WRONG", 500); //
  //res.status(errorCode);
  //res.status(500).send("Something broke!");
  next(e); //
});
app.use((error: MyError, req: any, res: any, next: any) => {
  console.log("error controller22", error);
  const errorCode = error.code || 500;
  const errorMsg = error.msg || "unknown error occurd";
  //res.status(errorCode);
  //res.status(500).send("Something broke!");
  res.status(errorCode).json({ status: "fail", message: error.msg });
});
export { app };
