import Quotes from "../models/Quotes";
import { IQuote } from "../library/interfaces";
import { NextFunction, Request, Response } from "express";

const getAllQuotes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<IQuote[] | undefined> => {
  try {
    const lengthOfCollection = await Quotes.find().count();
    if (!req.params || !req.params.limit || req.params.limit === "") {
      const results = await Quotes.find();
      res.status(200).json({ results });
      return results;
    } else if (
      !/^\d+$/.test(req.params.limit) ||
      parseInt(req.params.limit) >= lengthOfCollection
    ) {
      res.status(400).send("BAD REQUEST");
    } else {
      const results = await Quotes.find().limit(parseInt(req.params.limit));
      res.status(200).json({ results });
      return results;
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getRandomQuote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<IQuote[] | undefined> => {
  try {
    const results = await Quotes.aggregate([{ $sample: { size: 1 } }]);
    res.status(200).json({ results });
    return results;
  } catch (error) {
    res.status(500).json({ error });
  }
};
export default { getRandomQuote, getAllQuotes };
