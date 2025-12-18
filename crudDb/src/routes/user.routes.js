import { Router } from "express";
// import { addUser,getUser,getUsers,editUser,deleteUser } from "../controllers/user.controller.js";
import { upsertUser ,getUsers} from "../controllers/userController3.js";
const router=Router()

router.post('/',upsertUser)
router.get('/',getUsers)
// router.patch('/',addRole)
// router.get('/profile',getUser)
// router.put('/',updateUser)
// router.post('/block',blockUser)
// router.post('/upsert',upsert)

export default router