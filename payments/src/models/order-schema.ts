import { OrderStatus } from "@ranmicroserviceapp/common";
import mongoose, { Schema, model } from "mongoose";
import { Model } from "mongoose";

//interface that describe the properties for the schema
//also some props that are not coming in the constructor

// interface userAttributes {
//   email: string;
//   password: string;
//   phone?: string;
// }
interface IOrder {
  //STATUS IS ENUM FROMM COMMON
  status: OrderStatus;
  _id: string;
  userId: string;
  version: number;
  price: number;
}

// Put all user instance methods in this interface:
interface IOrderMethods {
  transform(): any;
}
type OrderModel = Model<IOrder, {}, IOrderMethods>;
let orderSchema = new Schema({
  status: { type: String, enum: Object.values(OrderStatus), required: true },
  userId: { type: String, required: true },
  _id: { type: String, required: true },
  price: { type: Number, required: true },
  version: { type: Number, required: true },
  //ref to the tickets
});
orderSchema.method("transform", function () {
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
const Order = model<IOrder, OrderModel>("Order", orderSchema);
//const User = mongoose.model("User", userSchema);

// export const buildUser = (attributes: userAttributes) => {
//   return new User(attributes);
// };

export default Order;
