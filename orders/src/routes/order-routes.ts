import express from "express";
import {
  createOrder,
  deleteOrderById,
  getOrderById,
  getOrders,
  saveTicketToDb,
  test,
} from "../controllers/order-controllers";
import { checkToken, checkUser } from "@ranmicroserviceapp/common";
const router = express.Router();

router.get("/test", test); //
router.get("/getOrders", checkToken, checkUser, getOrders); //
router.delete(
  "/deleteOrderById/:orderId",
  checkToken,
  checkUser,
  deleteOrderById
);
router.post("/createOrder", checkToken, checkUser, createOrder); //
router.post("/saveTicketToDb", saveTicketToDb); //

router.get("/getOrderById/:orderId", checkToken, checkUser, getOrderById); //

export { router as orderRouter };
