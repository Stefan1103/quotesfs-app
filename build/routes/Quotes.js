"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const Quotes_1 = __importDefault(require("../controllers/Quotes"));
const router = express_1.default.Router();
router.get("/quotes/:limit?", Quotes_1.default.getAllQuotes);
router.get("/random", Quotes_1.default.getRandomQuote);
module.exports = router;
