import pool from "../config/db.config.js";

export const addUser=async(req , res)=>{
    const{name,email}=req.body
    if(!name || !email) return res.status(400).send("email & name can't be empty")
        //insert role id + dept Id
        const query='insert into userdata (name,email) values(?,?)'
    try {
        const[user]=await pool.query(query,[name,email])
        res.status(201).json({user})
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}
export const getUsers=async(req , res)=>{
    try {
        const query='select * from userdata'
        const[user]=await pool.query(query)
        res.status(200).json({user})
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

export const edit=async(req , res)=>{
    try {
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}
export const updateUser=async(req , res)=>{
    try {
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}