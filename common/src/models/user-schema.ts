import mongoose, { Schema, model } from "mongoose";
import { Model } from "mongoose";

//interface that describe the properties for the schema
//also some props that are not coming in the constructor

// interface userAttributes {
//   email: string;
//   password: string;
//   phone?: string;
// }
interface IUser {
  password: string;
  email: string;
}

// Put all user instance methods in this interface:
interface IUserMethods {
  transform(): any;
}
type UserModel = Model<IUser, {}, IUserMethods>;
let userSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, required: true },
});
userSchema.method("transform", function () {
  var obj: any = this.toObject();

  //Rename fields
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.password;
  delete obj.__v;

  return obj;
});
//building in schema method

// userSchema.statics.build = (attributes: userAttributes) => {
//   return new User(attributes);
// };
const User = model<IUser, UserModel>("User", userSchema);
//const User = mongoose.model("User", userSchema);

// export const buildUser = (attributes: userAttributes) => {
//   return new User(attributes);
// };

export default User;
