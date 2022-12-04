import express, { Request, Response, NextFunction } from "express";
import http from "http";
import mongoose, { Callback, mongo } from "mongoose";
import { config } from "./config/config";
import Logging from "./library/Logging";
import axios from "axios";
import { IQuotes } from "./library/interfaces";
import Quotes from "./models/Quotes";
import quotesRoutes from "./routes/Quotes";

const router = express();

/** Connect to Mongo */
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongo.url, {
      retryWrites: true,
      w: "majority",
    });
    Logging.info("Connected to mongoDB");
    StartServer();
  } catch (error) {
    Logging.error("Unable to connect: ");
    Logging.error(error);
  }
};
connectDB();

const StartServer = (): void => {
  router.use((req: Request, res: Response, next: NextFunction) => {
    /** Log the Request */
    Logging.info(
      `Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`,
    );

    /**Log the Response */
    res.on("finish", (): void => {
      Logging.info(
        `Outgoing -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`,
      );
    });
    next();
  });
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  /**Rules of the API */
  router.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Method",
        "PUT, POST, PATCH, DELETE, GET",
      );
      return res.status(200).json({});
    }
    next();
  });

  /**Routes */
  router.use("/", quotesRoutes);

  /** server check */
  router.get("/success", (req: Request, res: Response, next: NextFunction) =>
    res.status(200).json({ message: "success" }),
  );
  /**Error Handling */
  router.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("not found");
    Logging.error(error);
    return res.status(404).json({ message: error.message });
  });
  /** CALL External API */
  const url = "https://api.quotable.io/quotes";

  const getQuotes = async (): Promise<void> => {
    try {
      const response = await axios.get(url);
      const results: IQuotes = await response.data;
      for (let i = 0; i < results.results.length; i++) {
        await Quotes.updateOne(
          { _id: results.results[i]._id },
          {
            $set: {
              _id: results.results[i]._id,
              author: results.results[i].author,
              content: results.results[i].content,
              tags: results.results[i].tags,
              authorSlug: results.results[i].authorSlug,
              length: results.results[i].length,
              dateAdded: results.results[i].dateAdded,
              dateModified: results.results[i].dateModified,
            },
          },
          { upsert: true },
        );
      }
    } catch (error) {
      Logging.error(error);
    }
  };
  getQuotes();

  http
    .createServer(router)
    .listen(config.server.port, (): void =>
      Logging.info(`Server is running on port ${config.server.port}.`),
    );
};
