import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  test,
  updateTicket,
} from "../controllers/ticket-controllers";
const router = express.Router();
import { check, body } from "express-validator";
//import { checkToken, checkUser } from "../middleware/userMiddleWare";
import { checkToken, checkUser } from "@ranmicroserviceapp/common";
import { checkSchema } from "../middleWare";
router.get("/test", test);
router.post("/createTicket", checkToken, checkUser, checkSchema, createTicket);
router.get("/getTickets", getTickets); //
router.get("/getTicket/:ticketId", getTicketById);
router.delete("/deleteTicket/:ticketId", getTicketById);
router.get("/getTicketsByUser/:userId", getTicketById);
router.put("/updateTicket", checkToken, checkUser, updateTicket);
//
export { router as ticketRouter };
