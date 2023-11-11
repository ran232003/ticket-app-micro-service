import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@ranmicroserviceapp/common";

export class PaymentCreatedEventPublisher extends Publisher<PaymentCreatedEvent> {
  //   subject = "ticket:created";
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  //groupName = "payment-service";
}
