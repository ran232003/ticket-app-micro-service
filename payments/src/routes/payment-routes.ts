import express from "express";

import { checkToken, checkUser } from "@ranmicroserviceapp/common";
import { payOrder } from "../controllers/payment-controller";
import { check } from "../middleWare";
const router = express.Router();
router.post(
  "/payOrder",
  checkToken,
  checkUser,
  check("payment-schema"),
  payOrder
);
export { router as paymentRouter };
