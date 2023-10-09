import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderExpierdEvent {
  subject: Subjects.OrderExpired;
  data: {
    orderId: string;
  };
}
