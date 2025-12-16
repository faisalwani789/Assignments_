import { Router } from "express";
import { getStudents,getStudent } from "../controllers/student.controller.js";
const router=Router()
router.get('/',getStudents)
router.get('/profile',getStudent)


export default router
