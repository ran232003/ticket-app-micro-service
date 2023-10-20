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
interface IPayment {
  //STATUS IS ENUM FROMM COMMON

  orderId: string;
  stripeId: string;
}

// Put all user instance methods in this interface:
interface IPaymentMethods {
  transform(): any;
}
type PaymentModel = Model<IPayment, {}, IPaymentMethods>;
let paymentSchema = new Schema({
  orderId: { type: String, required: true },
  stripeId: { type: String, required: true },

  //ref to the tickets
});
paymentSchema.method("transform", function () {
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
const Payment = model<IPayment, PaymentModel>("Payment", paymentSchema);
//const User = mongoose.model("User", userSchema);

// export const buildUser = (attributes: userAttributes) => {
//   return new User(attributes);
// };

export default Payment;
