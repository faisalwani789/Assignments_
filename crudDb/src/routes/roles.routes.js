import { Router } from "express";
import { addStudent, addTeacher } from "../controllers/user.controller2.js";

const router=Router()
router.post('/student',addStudent)
router.post('/teacher',addTeacher)

export default router