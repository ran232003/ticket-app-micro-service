import { NextFunction, Request, Response } from "express";
import Ajv from "ajv";
import { MyError } from "@ranmicroserviceapp/common";
const orderSchema = require("./schema/orderSchema.json");
const ajv = new Ajv();

export const checkSchemaUpdateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validate_schema = ajv.compile(orderSchema);
    let vaildate = validate_schema(req.body);
    if (vaildate) {
      next();
    } else {
      console.log(validate_schema.errors);
      let err = new MyError("Schema Error", 400);
      next(err);
    }
  } catch (error) {
    let err = new MyError("Internal Error", 500); //
    next(err);
  }
};
