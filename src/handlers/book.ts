import User, { IUser } from "../models/User";
import { Request, Response } from "express";
import Book from "../models/Book";
import BookUser from "../models/BookUser";
import mongoose, { Document, Schema } from "mongoose";
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const processBookCheckout = async (
  type: string,
  bookId: string,
  userId: string
) => {
  const book = await Book.findByIdAndUpdate(
    bookId,
    { $inc: { stock: type === "checkout" ? -1 : 1 } },
    { new: true }
  );

  let bookReg = await BookUser.findOne({
    user_id: new mongoose.Types.ObjectId(userId),
    book_id: new mongoose.Types.ObjectId(bookId),
  });

  if (type === "checkout" && bookReg) {
    bookReg.status = "in_progress";
  } else {
    bookReg = new BookUser({
      user_id: userId,
      book_id: bookId,
      status: "returned",
    });
  }
  await bookReg.save();

  return book;
};

const getUserBooks = async (req: any, res: Response) => {
  try {
    const books = await BookUser.find({ user_id: req.user._id }).exec();

    res.send({ success: true, books });
  } catch (error: any) {
    res.status(401).send({ success: false, error: error.message });
  }
};

const addNewBook = async (req: any, res: Response) => {
  try {
    const { title, author, synapsis, stock } = req.body;
    const book = new Book({ title, author, synapsis, stock });
    await book.save();

    res.send({ success: true, book });
  } catch (error) {
    res.status(401).send({ success: false, error });
  }
};

const showBook = async (req: any, res: Response) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    res.send({ success: true, book });
  } catch (error) {
    res.status(401).send({ success: false, error });
  }
};

const checkoutBook = async (req: any, res: Response) => {
  try {
    const { bookId } = req.params;
    let book = await Book.findById(bookId);

    if (!book || book.stock < 1) {
      res.status(401).send({ success: false, error: "Book is out of stock" });
    }

    book = await processBookCheckout("checkout", bookId, req.user);

    res.send({ success: true, book });
  } catch (error) {
    res.status(401).send({ success: false, error });
  }
};

const returnBook = async (req: any, res: Response) => {
  try {
    const { bookId, userEmail } = req.body;
    let book = await Book.findById(bookId);
    const user = await User.findOne({email: userEmail})

    if (!book || book.stock < 1) {
      res.status(401).send({ success: false, error: "Book is out of stock" });
    }


    const userId = user ? String(user._id) : '';
    book = await processBookCheckout("return", bookId, userId);

    res.send({ success: true, book });
  } catch (error: any) {
    res.status(401).send({ success: false, error: error.message });
  }
};

module.exports = {
  getUserBooks,
  addNewBook,
  showBook,
  checkoutBook,
  returnBook,
};
