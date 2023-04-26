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
const Quotes_1 = __importDefault(require("../models/Quotes"));
const getAllQuotes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lengthOfCollection = yield Quotes_1.default.find().count();
        if (!req.params || !req.params.limit || req.params.limit === "") {
            const results = yield Quotes_1.default.find();
            res.status(200).json({ results });
            return results;
        }
        else if (!/^\d+$/.test(req.params.limit) ||
            parseInt(req.params.limit) >= lengthOfCollection) {
            res.status(400).send("BAD REQUEST");
        }
        else {
            const results = yield Quotes_1.default.find().limit(parseInt(req.params.limit));
            res.status(200).json({ results });
            return results;
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const getRandomQuote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield Quotes_1.default.aggregate([{ $sample: { size: 1 } }]);
        res.status(200).json({ results });
        return results;
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.default = { getRandomQuote, getAllQuotes };
