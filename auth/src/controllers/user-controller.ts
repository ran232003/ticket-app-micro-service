import express from "express";
import User from "../models/user-schema";
import { error } from "console";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query, validationResult } from "express-validator";
import { MyError } from "../models/MyError";
export const getCurrentUser = async (req: any, res: any, next: any) => {
  // const userId = decoded["id"];
  console.log("get current", req.currentUser);
  return res.json({ status: "ok", user: req.currentUser });

  // verify a token
};
export const signup = async (req: any, res: any, next: any) => {
  try {
    error("This is an error");
    console.debug("This is an error");
    console.log(req.body);
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const myError = new MyError("FAILD VALIDATION", 400);
      return next(myError);
      //return res.json({ status: "fail", res: errors });
    }
    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
      console.log(checkUser, "userFound");
      const myError = new MyError("User Exist", 500);
      return next(myError);
    }
    console.log("before");
    let hashPassword = await bcrypt.hash(req.body.password, 12);
    console.log("after1", hashPassword);

    let user = new User({ email: email, password: hashPassword });

    await user.save();

    let returnUser = user.transform();
    console.log("before2");
    if (!process.env.JWT_KEY) {
      const myError = new MyError("env var error", 500);
      return next(myError);
    }
    let token = jwt.sign(
      { id: returnUser.id, email: returnUser.email },
      process.env.JWT_KEY,
      {
        expiresIn: "1d",
      }
    ); //base64 encoded
    //only when we configure the coockieSession in app.js
    req.session = {
      jwt: token,
    };
    console.log("user", user, token);
    return res.json({ status: "ok", user: returnUser, token: token });
  } catch (error) {
    console.log("in catch", error);
    const myError = new MyError("Somthing went very wrong!", 500);
    return next(myError);
  }
};
export const signin = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const myError = new MyError("FAILD VALIDATION", 400);
    console.log("req.body");
    return next(myError);
    //return res.json({ status: "fail", res: errors });
  }
  const { email, password } = req.body;
  const dbUser = await User.findOne({ email: email });
  if (!dbUser) {
    const err = new MyError("User Not Exist", 500);
    return next(err);
  }

  let passwordCheck = await bcrypt.compare(req.body.password, dbUser.password);
  if (!passwordCheck) {
    const err = new MyError("Wrong Details", 500);
    return next(err);
  }
  //checking if env var is available for token creation
  if (!process.env.JWT_KEY) {
    const myError = new MyError("env var error", 500);
    return next(myError);
  }
  const user = dbUser.transform();
  let token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_KEY,
    {
      expiresIn: "1d",
    }
  );
  //base64 encoded
  req.session = {
    jwt: token,
  };
  return res.json({
    status: "ok",
    user: user,
    token: token,
  });
};
export const signout = (req: any, res: any, next: any) => {
  //deleting the info on the coockie
  req.session = null;
  return res.json({ status: "ok" });
};
