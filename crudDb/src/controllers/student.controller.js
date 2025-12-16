import pool from "../config/db.config.js"
export const getStudents=async(req,res)=>{
    const query='select * from student join users on student.user_id=users.id'
    try {
        const[result]= await pool.query(query)
        res.json(result)
    
    } catch (error) {
        res.send(error.message)
    }
}

export const getStudent=async(req,res)=>{
    const{id}=req.body
    const query='select * from student join users on student.user_id=users.id where users.id=?'
    try {
        const[result]= await pool.query(query,[id])
        res.json(result)
       
    } catch (error) {
        res.send(error.message)
    }
}