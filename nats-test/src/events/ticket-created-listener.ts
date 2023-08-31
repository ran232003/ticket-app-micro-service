import { Message } from "node-nats-streaming";
import { Listen } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

//class for ticketCreatedListner
export class ticketCreatedListner extends Listen<TicketCreatedEvent> {
  //   subject = "ticket:created";
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  groupName = "payment-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("onMessage", data);
    msg.ack();
  }
}
