"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const Logging_1 = __importDefault(require("./library/Logging"));
const axios_1 = __importDefault(require("axios"));
const Quotes_1 = __importDefault(require("./models/Quotes"));
const Quotes_2 = __importDefault(require("./routes/Quotes"));
const router = (0, express_1.default)();
/** Connect to Mongo */
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.config.mongo.url, {
            retryWrites: true,
            w: "majority",
        });
        Logging_1.default.info("Connected to mongoDB");
        StartServer();
    }
    catch (error) {
        Logging_1.default.error("Unable to connect: ");
        Logging_1.default.error(error);
    }
});
connectDB();
const StartServer = () => {
    router.use((req, res, next) => {
        /** Log the Request */
        Logging_1.default.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        /**Log the Response */
        res.on("finish", () => {
            Logging_1.default.info(`Outgoing -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });
        next();
    });
    router.use(express_1.default.urlencoded({ extended: true }));
    router.use(express_1.default.json());
    /**Rules of the API */
    router.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        if (req.method == "OPTIONS") {
            res.header("Access-Control-Allow-Method", "PUT, POST, PATCH, DELETE, GET");
            return res.status(200).json({});
        }
        next();
    });
    /**Routes */
    router.use("/", Quotes_2.default);
    /** server check */
    router.get("/success", (req, res, next) => res.status(200).json({ message: "success" }));
    /**Error Handling */
    router.use((req, res, next) => {
        const error = new Error("not found");
        Logging_1.default.error(error);
        return res.status(404).json({ message: error.message });
    });
    /** CALL External API */
    const url = "https://api.quotable.io/quotes";
    const getQuotes = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url);
            const results = yield response.data;
            for (let i = 0; i < results.results.length; i++) {
                yield Quotes_1.default.updateOne({ _id: results.results[i]._id }, {
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
                }, { upsert: true });
            }
        }
        catch (error) {
            Logging_1.default.error(error);
        }
    });
    getQuotes();
    http_1.default
        .createServer(router)
        .listen(config_1.config.server.port, () => Logging_1.default.info(`Server is running on port ${config_1.config.server.port}.`));
};
