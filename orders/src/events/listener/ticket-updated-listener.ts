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
    data: {
      id: string;
      title: string;
      price: number;
      userId: string;
      version: number;
    },
    msg: Message
  ) {
    //with message we will return the ack
    console.log(data, "TicketUpdateListener");
    const ticket = await Ticket.findById(data.id);
    if (!ticket) {
      throw new Error("Ticket Not Found");
    }
    if (ticket.version + 1 !== data.version) {
      //if the version in the order db is not smaller then 1 from the ticket update
      //we want to update 1 by one
      throw new Error("Error Version Ticket");
    }
    ticket.set({
      price: data.price,
      title: data.title,
      version: data.version,
    });

    msg.ack();
  }
}
