import { Router } from "express";
import { getTeacher,getTeachers } from "../controllers/teacher.controller.js";
const router=Router()
router.get('/',getTeachers)
router.get('/profile',getTeacher)


export default router