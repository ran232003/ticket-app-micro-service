import { MyError, OrderStatus } from "@ranmicroserviceapp/common";
import { NextFunction, Request, Response } from "express";
import Order from "../models/order-schema";
import stripe from "../stripe";
import Payment from "../models/payment-schema";

export const payOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("payOrder", req.body);
  try {
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      const err = new MyError("Order Not Found", 400);
      return next(err);
    }
    console.log(order?.userId!, req.currentUser);
    if (order?.userId !== req.currentUser?.id) {
      const err = new MyError("User Incorrect", 500);
      return next(err);
    }
    if (order.status === OrderStatus.Cancelled) {
      const err = new MyError("order is cancelled", 400);
      return next(err);
    }
    //tok_visa: for summy token
    const charge = await stripe.charges.create({
      amount: order.price * 100, //we are sending cents
      currency: "usd",
      source: token,
    });
    const payment = new Payment({ orderId: order._id, stripeId: charge.id });
    await payment.save();
    // order.set({
    //     status:OrderStatus.Complete
    // })
    return res.json({ msg: "ok", charge, payment });
  } catch (error) {
    console.log(error);
    const err = new MyError("Internal Server Error", 500);
    return next(err);
  }
};
