import { NextFunction, Request, Response } from "express";
import Ajv from "ajv";
import { MyError } from "@ranmicroserviceapp/common";
export const test = (req: Request, res: Response, next: NextFunction) => {
  console.log("here", req.body);
  return res.json({ status: "ok" });
};
export const getOrders = (req: Request, res: Response, next: NextFunction) => {
  console.log("getOrders", req.body);
  return res.json({ status: "ok" });
};
export const getOrderById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.orderId;

  console.log("getOrderById", req.body);
  return res.json({ status: "ok" });
};
export const createOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("createOrder", req.body);
  return res.json({ status: "ok" });
};
export const deleteOrderById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.orderId;
  console.log("deleteOrderById", req.body);
  return res.json({ status: "ok" });
};
