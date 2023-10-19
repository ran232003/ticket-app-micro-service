import {
  Listen,
  MyError,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
  TicketCreatedEvent,
} from "@ranmicroserviceapp/common";
import { Message } from "node-nats-streaming";

import { natsWrraper } from "../../nats-wrapper";
import Order from "../../models/order-schema";

//creating listener that listen to order created
export class OrderCreatedListener extends Listen<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
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
        price: number;
      };
    },
    msg: Message
  ) {
    console.log(data, "OrderCreatedListener");
    let order = new Order({
      version: data.version,
      price: data.ticket.price,
      _id: data.id,
      userId: data.userId,
      status: data.status,
    });
    await order.save();

    msg.ack();
  }
}
