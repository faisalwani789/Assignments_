import { Router } from "express";
// import { addUser,getUser,getUsers,editUser,deleteUser } from "../controllers/user.controller.js";
import { addUser,getUsers,getUser } from "../controllers/user.controller2.js";
const router=Router()

router.post('/',addUser)
router.get('/',getUsers)
// router.patch('/',addRole)
router.get('/profile',getUser)
// router.put('/:id',editUser)
// router.delete('/:id',deleteUser)

export default router