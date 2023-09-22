import {
  Listen,
  Subjects,
  TicketUpdatedEvent,
} from "@ranmicroserviceapp/common";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/ticket-schema";

//creating listener that listen to ticket created
export class TicketUpdateListener extends Listen<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated; //like kafka topic
  groupName = "order-service"; //group name design from load balance if we have multiple order service
  async onMessage(
    data: { id: string; title: string; price: number; userId: string },
    msg: Message
  ) {
    //with message we will return the ack
    console.log(data, "TicketUpdateListener");
    const ticket = await Ticket.findById(data.id);
    if (!ticket) {
      throw new Error("Ticket Not Found");
    }
    ticket.set({
      price: data.price,
      title: data.title,
    });

    msg.ack();
  }
}
