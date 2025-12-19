import { Router } from "express";
import { addUser, getUser } from "../controllers/user.controller.js";
const router=Router()
router.post("/",addUser)
router.get('/',getUser)

export default router