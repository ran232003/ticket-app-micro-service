import {
  Listen,
  MyError,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
  TicketCreatedEvent,
} from "@ranmicroserviceapp/common";
import { Message } from "node-nats-streaming";
//   import Ticket from "../../models/ticket-schema";
//   import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";
import { natsWrraper } from "../../nats-wrapper";

//creating listener that listen to order created
export class OrderCreatedListener extends Listen<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  groupName = "expiration-service";
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
    console.log(data, "OrderCreatedListener- expiration service");

    //   const ticketId = data.ticket.ticketId;
    //   const ticket = await Ticket.findById(ticketId);
    //   if (!ticket) {
    //     throw new MyError("Ticket Not Found", 500);
    //   }
    //   ticket.orderId = data.id;
    //   ticket.version = ticket.version + 1;
    //   await ticket.save();
    //   let message = {
    //     userId: data.userId,
    //     id: data.ticket.ticketId,
    //     price: ticket.price,
    //     title: ticket.title,
    //     version: ticket.version,
    //   };
    //await new TicketUpdatedPublisher(natsWrraper.getClient()).publish(message);
    msg.ack();
  }
}
