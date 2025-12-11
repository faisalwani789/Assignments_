import { Router } from "express";
import { addUser,getUser,getUsers,editUser,deleteUser } from "../controllers/user.controller.js";
const router=Router()

router.post('/',addUser)
router.get('/',getUsers)
router.get('/:id',getUser)
router.put('/:id',editUser)
router.delete('/:id',deleteUser)

export default router