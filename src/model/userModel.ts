import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
_id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
}

const UserSchemas = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export const Users = mongoose.model<IUser>("Users", UserSchemas);
