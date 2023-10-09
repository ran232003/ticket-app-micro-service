import { OrderStatus } from "@ranmicroserviceapp/common";
import mongoose, { Schema, model } from "mongoose";
import { Model } from "mongoose";
import { TicketDoc } from "./ticket-schema";

//interface that describe the properties for the schema
//also some props that are not coming in the constructor

// interface userAttributes {
//   email: string;
//   password: string;
//   phone?: string;
// }
interface IExpiration {
  //STATUS IS ENUM FROMM COMMON
  orderId: string;
  status: string;
  expireAt: Date;
}

// Put all user instance methods in this interface:
interface IOrderMethods {
  transform(): any;
}
type ExpirationModel = Model<IExpiration, {}, IOrderMethods>;
let expirationSchema = new Schema({
  orderId: { type: String, required: true },
  status: { type: String, enum: ["New", "Expire"], required: true },
  expireAt: { type: mongoose.Schema.Types.Date },
});

//building in schema method

// userSchema.statics.build = (attributes: userAttributes) => {
//   return new User(attributes);
// };
const Expiration = model<IExpiration, ExpirationModel>(
  "Expiration",
  expirationSchema
);
//const User = mongoose.model("User", userSchema);

// export const buildUser = (attributes: userAttributes) => {
//   return new User(attributes);
// };

export default Expiration;
