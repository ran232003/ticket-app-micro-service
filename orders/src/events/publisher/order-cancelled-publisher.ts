import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from "@ranmicroserviceapp/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  //   subject = "ticket:created";
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  //groupName = "payment-service";
}
