import mongoose, { Document, Schema } from "mongoose";
const bcrypt = require("bcrypt");

export interface IBookUser extends Document {
  book_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  status: string;
}

const bookUserSchema: Schema = new Schema({
  book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, required: true },
});

const BookUser = mongoose.model<IBookUser>("BookUser", bookUserSchema);

export default BookUser;
