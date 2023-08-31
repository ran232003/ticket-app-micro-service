import { Message } from "node-nats-streaming";
import { Listen } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";
import { Publisher } from "./base-publisher";

//class for ticketCreatedListner
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  //   subject = "ticket:created";
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  //groupName = "payment-service";
}
