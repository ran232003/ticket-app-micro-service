import { MyError } from "@ranmicroserviceapp/common";
import Ticket from "../models/ticket-schema";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrraper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";

export const test = (req: any, res: any, next: any) => {
  console.log("here", req.body);
  return res.json({ status: "ok" });
};
export const createTicket = async (req: any, res: any, next: any) => {
  console.log("createTicket", req.body, "user", req.currentUser);
  try {
    let ticket = new Ticket({
      title: req.body.title,
      price: req.body.price,
      userId: req.currentUser.id,
      version: 1,
      orderId: "",
    });
    await ticket.save();
    ticket = ticket.transform();

    //publish to nats
    await new TicketCreatedPublisher(natsWrraper.getClient()).publish({
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      id: ticket.id,
      version: 1,
    });
    res.status(201);
    console.log("response", ticket);
    return res.json({
      status: "ok",
      createTicket: "createTicket",
      ticket: ticket,
    });
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
  console.log("updateTicket", req.body);
  // const job = await Job.updateOne(
  //   { _id: "64ba9a4f65b87c9cccc9dac7", jobs: "amdocs" },
  //   { $set: { "jobs.$": "amdocs next" } }
  // );
  try {
    const { title, price, ticketId } = req.body;
    let ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      const err = new MyError("Ticket Not Exist", 500);
      return next(err);
    }
    if (ticket.orderId) {
      const err = new MyError("Ticket Is Reserved", 500);
      return next(err);
    }
    let version = ticket.version + 1;
    ticket.set({
      title: title,
      price: price,
      version: version,
    });
    await ticket.save();
    // const ticket = await Ticket.updateOne(
    //   { _id: req.body.ticketId },
    //   { $set: { price: price, title: title } }
    // );
    // if (ticket.acknowledged === true && ticket.modifiedCount === 1) {
    //   console.log(
    //     req.currentUser,
    //     price,
    //     title,
    //     req.body.ticketId,
    //     "send update to nats"
    //   );
    //   let message = {
    //     userId: req.currentUser.id,
    //     id: req.body.ticketId,
    //     price,
    //     title,
    //   };
    //   await new TicketUpdatedPublisher(natsWrraper.getClient()).publish(
    //     message
    //   );
    // }
    let message = {
      userId: req.currentUser.id,
      id: req.body.ticketId,
      price,
      title,
      version,
    };
    ticket = ticket.transform();

    await new TicketUpdatedPublisher(natsWrraper.getClient()).publish(message);
    res.status(200);
    return res.json({ status: "ok", ticket: ticket });
  } catch (error) {
    console.log(error);
    const err = new MyError("Internal Error", 500);
    return next(err);
  }
};
export const getTicketById = async (req: any, res: any, next: any) => {
  try {
    const ticketId = req.params.ticketId;
    console.log("getTicketById", "ticketId", ticketId, "user", req.currentUser);

    let ticket = await Ticket.findById(ticketId);
    ticket = ticket?.transform();
    res.status(200);
    return res.json({ status: "ok", getTicketById: "ticket", ticket });
  } catch (error) {}
};
export const deleteTicketById = async (req: any, res: any, next: any) => {
  try {
    const ticketId = req.params.ticketId;
    console.log("getTicketById", "ticketId", ticketId, "user", req.currentUser);

    let ticket = await Ticket.deleteOne({ _id: ticketId });
    res.status(200);
    return res.json({
      status: "ok",
      getTicketById: "deleteTicketById",
      ticket,
    });
  } catch (error) {
    console.log(error);
    const err = new MyError("Internal Error", 500);
    return next(err);
  }
};
export const getTicketByUserId = async (req: any, res: any, next: any) => {
  try {
    const userId = req.currentUser.id;
    console.log("getTicketByUserId");

    let tickets = await Ticket.find({ userId: userId });
    let ticketsAfter = [];
    if (tickets) {
      for (let index = 0; index < tickets.length; index++) {
        const element = tickets[index];
        ticketsAfter.push(element.transform());
      }
    }

    res.status(200);
    return res.json({
      status: "ok",
      getTicketByUserId: "getTicketByUserId",
      ticketsAfter,
    });
  } catch (error) {
    console.log(error);
    const err = new MyError("Internal Error", 500);
    return next(err);
  }
};
