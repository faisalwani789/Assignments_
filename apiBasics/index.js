import express from 'express'
import userRouter from './src/routes/user.routes.js'
const Port=5000
const app=express()
app.use(express.json())
app.use("/users",userRouter)

app.listen(Port,()=>{
    console.log('listening to port '+ Port)
})