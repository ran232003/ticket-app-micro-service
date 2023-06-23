import express from "express";
import {
  getCurrentUser,
  signin,
  signout,
  signup,
} from "../controllers/user-controller";
const router = express.Router();
import { check, body } from "express-validator";
import { checkToken, checkUser } from "../middleware/userMiddleWare";
router.get("/currentuser", checkToken, checkUser, getCurrentUser);
router.post(
  "/signin",
  [check("email").isEmail(), body("password").isLength({ min: 6, max: 20 })],
  signin
);
router.post("/signout", signout);
router.post(
  "/signup",
  [check("email").isEmail(), body("password").isLength({ min: 6, max: 20 })],
  signup
);

export { router as userRouter };
