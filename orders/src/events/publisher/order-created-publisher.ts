import {
  Publisher,
  Subjects,
  OrderCreatedEvent,
} from "@ranmicroserviceapp/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  //   subject = "ticket:created";
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  //groupName = "payment-service";
}
