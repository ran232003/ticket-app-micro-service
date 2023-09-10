export enum OrderStatus {
  //order was created but ticket is not yet reserved
  Created = "created",
  //the ticket is not available or user cancel the order
  Cancelled = "cancelled",
  //order has sccessfully reserved the ticket
  AwaitingPayment = "awaiting_payment",
  //order has sccessfully reserved the ticket and user provide payment
  Complete = "complete",
}
