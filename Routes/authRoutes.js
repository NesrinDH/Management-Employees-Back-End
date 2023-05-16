
import express from "express"
import { forgetPassword, resetPassword, signIn } from "../Controlleurs/Authenticate.js";
const router = express.Router()

router.post("/auth/login", signIn)
router.post("/auth/forgetPassword", forgetPassword)
router.patch("/auth/resetPassword", resetPassword)

export default router;