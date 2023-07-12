import jwt from "jsonwebtoken";
import { MyError } from "../models/MyError";
import { Request } from "express";
interface UserVerify {
  id: string;
  email: string;
}
//adding to req the field with the user details from the token
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserVerify;
    }
  }
}

export const checkToken = async (req: Request, res: any, next: any) => {
  console.log("check user middle");

  if (!req.session?.jwt) {
    //checking if we have coockie, if not go next function
    return next();
  }
  const token = req.session.jwt;
  console.log("token", token, req.session, process.env.JWT_KEY);
  if (!token) {
    const myError = new MyError("token expire", 500);
    return next(myError);
  }
  try {
    //   //"decoded": {"id": "6479d94fadfc89b42f4e5c58","email": "ran23@email.com"}
    //as that mean return type userVerify
    var decoded = jwt.verify(token, process.env.JWT_KEY!) as UserVerify; //process.env.JWT_KEY! saining to typescript that we check it and its good
    console.log(decoded, "test");
    if (!decoded) {
      const myError = new MyError("Error token", 500);
      console.log("error token");
    }
    // const userId = decoded["id"];
    req.currentUser = decoded;
    return next();
  } catch (error) {
    const myError = new MyError("Error token", 500);
    console.log(error, "error token");

    return next(myError);
  }
  //if there is coockie
};
export const checkUser = async (req: Request, res: any, next: any) => {
  if (!req.currentUser) {
    const myError = new MyError("Error User Require", 500);
    console.log("Error User Require");
    return next(myError);
  }
  return next();
};
