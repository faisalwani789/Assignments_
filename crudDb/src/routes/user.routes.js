import { Router } from "express";
// import { addUser,getUser,getUsers,editUser,deleteUser } from "../controllers/user.controller.js";
import { addUser,getUsers,getUser,updateUser,blockUser } from "../controllers/user.controller2.js";
const router=Router()

router.post('/',addUser)
router.get('/',getUsers)
// router.patch('/',addRole)
router.get('/profile',getUser)
router.put('/',updateUser)
router.post('/block',blockUser)

export default router