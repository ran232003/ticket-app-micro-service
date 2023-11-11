import { NextFunction, Request, Response } from "express";
import Ajv from "ajv";
import { MyError, OrderStatus, Subjects } from "@ranmicroserviceapp/common";
import Ticket from "../models/ticket-schema";
import Order from "../models/order-schema";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import { natsWrraper } from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
import Expiration from "../models/expiration-schema";
export const test = (req: Request, res: Response, next: NextFunction) => {
  console.log("here", req.body);
  return res.json({ status: "ok" });
};
export const getAllExpire = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("getAllExpire");
  const expire = await Expiration.find();

  return res.json({ status: "ok", expire });
};
export const saveTicketToDb = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("here", req.body);
    const ticket = new Ticket({
      price: req.body.price,
      title: req.body.title,
      _id: req.body.id,
    });
    await ticket.save();
    return res.json({ status: "ok", ticket });
  } catch (error) {
    console.log(error);
    const err = new MyError("Internal Error", 500);
    next(err);
  }
};
export const getOrdersByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let userId = req.currentUser?.id;
    console.log("getOrders", req.currentUser?.id);
    const orders = await Order.find({ userId: userId });
    let ordersAfter = orders.map((order) => {
      return order.transform();
    });
    return res.json({ status: "ok", orders: ordersAfter });
  } catch (error) {
    console.log(error);
    const err = new MyError("Internal Error", 500);
    next(err);
  }
};
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let userId = req.currentUser?.id;
    console.log("getOrders", req.currentUser?.id);
    const orders = await Order.find({ userId: userId }).populate("ticket");

    return res.json({ status: "ok", orders: orders });
  } catch (error) {
    console.log(error);
    const err = new MyError("Internal Error", 500);
    next(err);
  }
};
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.orderId;
  const userId = req.currentUser?.id;

  console.log("getOrderById", orderId);
  try {
    //let order = await Order.findById(orderId);
    //populate = geting the ref ticket and put the object and not only the id in response
    let order = await Order.findOne({ _id: orderId, userId: userId }).populate(
      "ticket"
    );
    if (!order) {
      const err = new MyError("Order Not Found", 500);
      return next(err);
    }

    const currentDate = new Date();
    if (order.expireAt < currentDate) {
      const err = new MyError("Order Expire", 500);
      return next(err);
    }
    console.log();
    return res.json({ status: "ok", order, currentDate });
  } catch (error) {}
};
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("createOrder", req.body);
  try {
    // find ticket for the order && check if ticket is not already reserved
    const ticket = await Ticket.findById(req.body.ticketId);
    if (!ticket) {
      const err = new MyError("Ticket Not Found", 401);
      return next(err);
    }
    const test = await Order.find({ userId: req.currentUser?.id })
      .populate("ticket")
      .exec();
    const isReserved = test.find((dbOrder) => {
      return dbOrder.ticket._id === ticket._id;
    });
    console.log("check", isReserved);
    // const isReserved = await Order.findOne({
    //   $and: [
    //     { "ticket._id": ticket._id },
    //     {
    //       $or: [
    //         { status: OrderStatus.Complete },
    //         { status: OrderStatus.AwaitingPayment },
    //         { status: OrderStatus.Complete },
    //       ],
    //     },
    //   ],
    // });
    // console.log(isReserved, "is reserved");
    if (isReserved) {
      const err = new MyError("Ticket is Reserved", 400);
      return next(err);
    }

    const exp = new Date();
    exp.setSeconds(exp.getSeconds() + 15 * 60);
    //create order and save to DB
    const order = new Order({
      userId: req.currentUser?.id,
      status: OrderStatus.Created,
      expireAt: exp,
      ticket: ticket,
      version: 1,
    });
    const expire = new Expiration({
      status: "New",
      orderId: order._id,
      expireAt: exp,
    });
    await expire.save();
    await order.save();
    //send message to NATS
    await new OrderCreatedPublisher(natsWrraper.getClient()).publish({
      id: order._id.toString(),
      userId: order.userId,
      status: order.status,
      version: 1,
      expireAt: order.expireAt.toISOString(),
      ticket: {
        ticketId: order.ticket._id.toString(),
        price: order.ticket.price,
      },
    });
    const orders = await Order.find({ userId: order.userId }).populate(
      "ticket"
    );

    return res.json({ status: "ok", order, orders });
  } catch (error) {
    console.log(error);
    const err = new MyError("Internal Error", 500);
    next(err);
  }
};
export const deleteOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //change status to cancel
  const orderId = req.params.orderId;
  let userId = req.currentUser?.id;
  console.log("deleteOrderById", orderId);
  const update = { status: OrderStatus.Cancelled };
  try {
    const order = await Order.findOne({ _id: orderId, userId: userId });
    if (!order) {
      const err = new MyError("Internal Error", 500);
      return next(err);
    }
    order.status = OrderStatus.Cancelled;
    order.version = order.version + 1;
    await order.save();
    console.log("before publish");
    await new OrderCancelledPublisher(natsWrraper.getClient()).publish({
      id: order._id.toString(),
      userId: order.userId,
      version: order.version,
      ticket: {
        ticketId: order.ticket._id.toString(),
      },
    });
    console.log("after publish");
    return res.json({ status: "ok", order });
  } catch (error) {
    console.log(error);
    const err = new MyError("Internal Error", 500);
    next(err);
  }
};
