import express from "express";
import { test } from "../controllers/ticket-controllers";
const router = express.Router();
import { check, body } from "express-validator";
//import { checkToken, checkUser } from "../middleware/userMiddleWare";
import { checkToken, checkUser } from "@ranmicroserviceapp/common";
router.get("/test", test);

export { router as ticketRouter };
