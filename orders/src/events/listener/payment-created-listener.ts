import {
  Listen,
  MyError,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
  TicketCreatedEvent,
} from "@ranmicroserviceapp/common";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/ticket-schema";
import Order from "../../models/order-schema";

//creating listener that listen to ticket created
export class PaymentCreatedListener extends Listen<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  groupName = "order-service";
  async onMessage(
    data: {
      id: string;
      orderId: string;

      stripeId: string;
    },
    msg: Message
  ) {
    console.log(data, "PaymentCreatedListener");
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new MyError("Order Not Exist", 400);
    }
    order.set({ status: OrderStatus.Complete, version: order.version + 1 });
    await order.save();
    //with message we will return the ack

    msg.ack();
  }
}
