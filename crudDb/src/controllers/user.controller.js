import pool  from "../config/db.config.js"
import idGenerator from "../utils/idGenerator.js"
export const addUser=async(req,res)=>{
    const{name,email}=req.body
    const id=idGenerator()
    try {
        const[user]=await pool.query('INSERT INTO userdata (id,name,email) VALUES(?,?,?)',[id,name,email] )
         res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error.message)
    }
}
export const getUser=async(req,res)=>{
    const{id}=req.params
    try {
        const [user]=await pool.query('select * from userdata where id = ? ',[id])
        if(!user)res.status(400).send('no user found')
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error.message)
    }
}
export const getUsers=async(req,res)=>{
    const [users]=await pool.query('select * from userinfo')
    res.json(users)
}
export const editUser=async()=>{
    
}
export const deleteUser=async()=>{
    
}