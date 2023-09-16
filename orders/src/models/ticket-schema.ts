import mongoose, { Schema, model } from "mongoose";
import { Model } from "mongoose";
import Order from "./order-schema";
import { OrderStatus } from "@ranmicroserviceapp/common";

//interface that describe the properties for the schema
//also some props that are not coming in the constructor

// interface userAttributes {
//   email: string;
//   password: string;
//   phone?: string;
// }
interface ITicket {
  title: string;
  price: number;
  _id: String;
}

export interface TicketDoc {
  title: string;
  price: number;
  _id: String;
}
// Put all user instance methods in this interface:
interface ITicketMethods {
  transform(): any;
  isReserved(): Promise<boolean>;
}
type TicketModel = Model<ITicket, {}, ITicketMethods>;
let ticketSchema = new Schema({
  title: { type: String, required: true },
  _id: { type: String, required: true },

  price: { type: Number, required: true },
});
ticketSchema.method("transform", function () {
  var obj: any = this.toObject();

  //Rename fields
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.password;
  delete obj.__v; //

  return obj;
});
ticketSchema.method("isReserved", async function () {
  var obj: any = this.toObject();

  const order = await Order.findOne({
    ticket: obj,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return order ? true : false;
});
//building in schema method

// userSchema.statics.build = (attributes: userAttributes) => {
//   return new User(attributes);
// };
const Ticket = model<ITicket, TicketModel>("Ticket", ticketSchema);
//const User = mongoose.model("User", userSchema);

// export const buildUser = (attributes: userAttributes) => {
//   return new User(attributes);
// };

export default Ticket;
