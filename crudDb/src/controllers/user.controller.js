import pool  from "../config/db.config.js"
import idGenerator from "../utils/idGenerator.js"
export const addUser=async(req,res)=>{
    const{name,email}=req.body
    if(!name || !email) return res.status(400).send("email & name can't be empty")
    const id=idGenerator()
    try {
        const[exists]=await pool.query('SELECT * FROM userdata where email=?',[email])
        if(exists.length>0)return res.status(400).send("user already exists")
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
        if(user.length ===0)return res.status(400).send('no user found')
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error.message)
    }
}
export const getUsers=async(req,res)=>{
    try {
         const [users]=await pool.query('select * from userdata')
    res.json(users)
    } catch (error) {
         res.status(500).json(error.message)
    }
   
}
export const editUser=async(req,res)=>{
    const{id}=req.params
    const{name,email}=req.body
    try {
         const [user]=await pool.query('UPDATE userdata SET name=?, email=? WHERE id=? ',[name,email,id])
         console.log(user)
         res.status(201).json('edited successfully')
    } catch (error) {
          res.status(500).json(error.message)
    }
}
export const deleteUser=async(req,res)=>{
     const{id}=req.params
    try {
        const [row]=await pool.query('DELETE FROM userdata WHERE id=? ',[id])
        res.status(201).json('deleted successfully')
    } catch (error) {
          res.status(500).json(error.message)
    }
}