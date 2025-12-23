import { Router } from "express";
import { addUser, getUser,getUsers } from "../controllers/user.controller.js";
import { UserSignIn } from "../controllers/auth.controller.js";
const router=Router()
router.post("/",addUser)
router.post('/signIn',UserSignIn)
router.get('/',getUsers)
router.get('/profile',getUser)

export default router