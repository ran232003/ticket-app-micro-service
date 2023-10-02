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
import Ticket from "../../models/ticket-schema";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";
import { natsWrraper } from "../../nats-wrapper";

//creating listener that listen to order created
export class OrderCancelledListener extends Listen<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  groupName = "ticket-service";
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

    // //with message we will return the ack
    // const ticket = new Ticket({
    //   price: data.price,
    //   title: data.title,
    //   _id: data.id,
    //   version: data.version,
    // });
    // await ticket.save();
    let ticket = await Ticket.findById(data.ticket.ticketId);
    if (!ticket) {
      throw new MyError("Ticket Not Found", 500);
    }
    ticket.orderId = "";
    ticket.version = ticket.version + 1;
    await ticket.save();
    let message = {
      userId: data.userId,
      id: data.ticket.ticketId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    };
    await new TicketUpdatedPublisher(natsWrraper.getClient()).publish(message);
    msg.ack();
  }
}
