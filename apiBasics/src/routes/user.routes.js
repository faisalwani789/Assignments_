import { Router } from "express";
import { createUser,getUser,getUsers,editUser,deleteUser } from "../controllers/user.controller.js";
import validation from "../middlewares/validation.middleware.js";
const router=Router()

router.post('/',validation,createUser)
router.get('/',getUsers)
router.get('/:id',getUser)
router.put('/:id',editUser)
router.delete('/:id',deleteUser)

export default router