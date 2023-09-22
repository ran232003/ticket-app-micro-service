import {
  Listen,
  Subjects,
  TicketCreatedEvent,
} from "@ranmicroserviceapp/common";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/ticket-schema";

//creating listener that listen to ticket created
export class TicketCreatedListener extends Listen<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  groupName = "order-service";
  async onMessage(
    data: {
      id: string;
      title: string;
      price: number;
      userId: string;
      version: number;
    },
    msg: Message
  ) {
    console.log(data, "TicketCreatedListener");

    //with message we will return the ack
    const ticket = new Ticket({
      price: data.price,
      title: data.title,
      _id: data.id,
      version: data.version,
    });
    await ticket.save();
    msg.ack();
  }
}
