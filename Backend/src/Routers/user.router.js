import { Router } from "express";
import { GetAllUsers, GetUserInfo, LogIn, SignUp } from "../Controllers/user.controller.js";
import {VerifyToken} from "../Middlewares/Auth.middleware.js"
const router=Router();
router.route("/signup").post(SignUp);
router.route("/login").post(LogIn);
router.route("/get-users").get(GetAllUsers);
router.route("/user-details").get(VerifyToken,GetUserInfo);
export default router;