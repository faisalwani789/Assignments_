import express from 'express'
import { configDotenv } from 'dotenv'
import userRouter from './src/routes/user.routes.js'
import roleRouter from './src/routes/roles.routes.js'
import studentRouter from './src/routes/student.routes.js'
import teacherRouter from './src/routes/teacher.routes.js'
const app=express()

configDotenv()
const PORT=process.env.PORT

app.use(express.json())

app.use('/users',userRouter)
app.use('/users/roles',roleRouter)
app.use('/users/students',studentRouter)
app.use('/users/teachers',teacherRouter)

app.listen(PORT,()=>{
    console.log('listening to port '+PORT)
})