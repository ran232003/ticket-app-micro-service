import { NextFunction, Request, Response } from "express";
import Ajv from "ajv";
import { MyError } from "@ranmicroserviceapp/common";
// const Ajv = require("ajv").default;
const ajv = new Ajv();
// const schema_user = require("../schema/userSchema.json");
// import ticketSchema from "./schema/ticketSchema.json";
const mySchema = require("./schema/ticketSchema.json");

export const checkSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validate_schema = ajv.compile(mySchema);
    let vaildate = validate_schema(req.body);
    if (vaildate) {
      next();
    } else {
      console.log(validate_schema.errors);
      let err = new MyError("Schema Error", 400);
      next(err);
    }
  } catch (error) {
    let err = new MyError("Internal Error", 500);
    next(err);
  }
};
