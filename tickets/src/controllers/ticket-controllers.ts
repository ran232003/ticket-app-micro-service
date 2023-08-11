import { MyError } from "@ranmicroserviceapp/common";
import Ticket from "../models/ticket-schema";

export const test = (req: any, res: any, next: any) => {
  console.log("here");
  return res.json({ status: "ok" });
};
export const createTicket = async (req: any, res: any, next: any) => {
  console.log("createTicket", req.body);
  try {
    let ticket = new Ticket(req.body);
    await ticket.save();
    ticket = ticket.transform();
    res.status(201);
    console.log("response", ticket);
    return res.json({ status: "ok", createTicket: "createTicket", ticket });
  } catch (error) {
    console.log(error);
    const err = new MyError("Internal Error", 500);
    return next(err);
  }
};
export const getTickets = async (req: any, res: any, next: any) => {
  console.log("getTickets");
  try {
    let tickets = await Ticket.find({}); //
    res.status(200);
    console.log("response", tickets);
    return res.json({ status: "ok", tickets });
  } catch (error) {
    console.log(error);
    const err = new MyError("Internal Error", 500);
    return next(err);
  }
}; //
export const updateTicket = async (req: any, res: any, next: any) => {
  console.log("updateTicket");
  res.status(200);
  return res.json({ status: "ok", createTicket: "updateTicket" });
};
export const getTicketById = async (req: any, res: any, next: any) => {
  try {
    const ticketId = req.params.ticketId;
    console.log("getTicketById", "ticketId", ticketId, "user", req.currentUser);

    let ticket = Ticket.findById(ticketId);

    res.status(200);
    return res.json({ status: "ok", getTicketById: "ticket", ticket });
  } catch (error) {
    console.log(error);
    const err = new MyError("Internal Error", 500);
    return next(err);
  }
};
