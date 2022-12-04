import express from "express";
import controller from "../controllers/Quotes";

const router = express.Router();

router.get("/quotes/:limit?", controller.getAllQuotes);
router.get("/random", controller.getRandomQuote);

export = router;
