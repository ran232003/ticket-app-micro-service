import mongoose, { Schema, model } from "mongoose";
import { Model } from "mongoose";

//interface that describe the properties for the schema
//also some props that are not coming in the constructor

// interface userAttributes {
//   email: string;
//   password: string;
//   phone?: string;
// }
interface ITicket {
  title: string;
  userId: string;
  price: number;
  version: number;
  orderId: string;
}

// Put all user instance methods in this interface:
interface ITicketMethods {
  transform(): any;
}
type TicketModel = Model<ITicket, {}, ITicketMethods>;
let ticketSchema = new Schema({
  title: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true },
  version: { type: Number, required: true },
  orderId: { type: String },
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
