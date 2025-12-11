import express from 'express'
import { configDotenv } from 'dotenv'
import userRouter from './src/routes/user.routes.js'
const app=express()

configDotenv()
const PORT=process.env.PORT

app.use(express.json())

app.use('/users',userRouter)

app.listen(PORT,()=>{
    console.log('listening to port '+PORT)
})