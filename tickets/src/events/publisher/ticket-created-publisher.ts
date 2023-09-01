import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@ranmicroserviceapp/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  //   subject = "ticket:created";
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  //groupName = "payment-service";
}
