import mongoose, { Document, Schema } from "mongoose";
import { IQuote } from "../library/interfaces";
export interface IQuoteModel extends IQuote {}

const QuoteSchema: Schema = new Schema(
  {
    _id: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    length: { type: Number },
    content: { type: String, required: true },
    dateAdded: { type: String },
    dateModified: { type: String },
    tags: { type: Array },
  },
  {
    versionKey: false,
  },
);

export default mongoose.model<IQuoteModel>("Quotes", QuoteSchema);
