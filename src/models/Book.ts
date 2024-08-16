import mongoose, { Document, Schema } from "mongoose";
const bcrypt = require("bcrypt");

export interface IBook extends Document {
  title: string;
  author: string;
  synapsis: string;
  stock: number;
}

const bookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  synapsis: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
});

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
