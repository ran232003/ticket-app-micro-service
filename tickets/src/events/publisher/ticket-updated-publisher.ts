import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@ranmicroserviceapp/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  //   subject = "ticket:created";
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  //groupName = "payment-service";
}
