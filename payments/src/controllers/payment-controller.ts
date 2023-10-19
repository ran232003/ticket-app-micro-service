import { NextFunction, Request, Response } from "express";

export const payOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("payOrder");
  return res.json({ msg: "ok" });
};
