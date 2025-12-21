import { Router } from "express";
import { addUser, getUser,getUsers } from "../controllers/user.controller.js";
const router=Router()
router.post("/",addUser)
router.get('/',getUsers)
router.get('/profile',getUser)

export default router