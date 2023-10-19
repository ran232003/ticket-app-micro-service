import {
  Listen,
  MyError,
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
  TicketCreatedEvent,
} from "@ranmicroserviceapp/common";
import { Message } from "node-nats-streaming";

import { natsWrraper } from "../../nats-wrapper";
import Order from "../../models/order-schema";

//creating listener that listen to order created
export class OrderCancelledListener extends Listen<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  groupName = "payment-service";
  async onMessage(
    data: {
      id: string;
      userId: string;
      status: OrderStatus;
      expireAt: string;
      version: number;
      ticket: {
        ticketId: string;
      };
    },
    msg: Message
  ) {
    console.log(data, "OrderCancelledListener");
    let orderId = data.id;

    let order = await Order.findOne({
      _id: orderId,
      version: data.version - 1,
    });
    if (!order) {
      throw new MyError("Order Not Found", 400);
    }
    order.set({
      version: data.version,
      status: data.status,
    });
    order.save();
    msg.ack();
  }
}
