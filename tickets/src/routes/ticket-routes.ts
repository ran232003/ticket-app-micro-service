import express from "express";
import {
  createTicket,
  getTickets,
  getTicketById,
  test,
  updateTicket,
  getTicketByUserId,
  deleteTicketById,
} from "../controllers/ticket-controllers";
const router = express.Router();
import { check, body } from "express-validator";
//import { checkToken, checkUser } from "../middleware/userMiddleWare";
import { checkToken, checkUser } from "@ranmicroserviceapp/common";
import {
  checkSchema,
  checkSchemaUpdateTicket,
  testMiddle,
} from "../middleWare";
//router.post("/test", testMiddle("myTest"), test);
router.post("/createTicket", checkToken, checkUser, checkSchema, createTicket);
router.get("/getTickets", getTickets); //
router.get("/getTicket/:ticketId", checkToken, checkUser, getTicketById);
router.delete(
  "/deleteTicket/:ticketId",
  checkToken,
  checkUser,
  deleteTicketById
);
router.get(
  "/getTicketsByUser/:userId",
  checkToken,
  checkUser,
  getTicketByUserId
);
router.patch(
  "/updateTicket",
  checkToken,
  checkUser,
  checkSchemaUpdateTicket,
  updateTicket
); //
//
export { router as ticketRouter };
