import pool from "../config/db.config.js"
export const getTeacher=async(req,res)=>{
    const{id}=req.body
      const query='select * from users join teacher on users.id=teacher.user_id where users.id=?'
    try {
        const[result]= await pool.query(query,[id])
        res.json(result)
        
    } catch (error) {
        res.send(error.message)
    }
}
export const getTeachers=async(req,res)=>{
    const query='select * from users join teacher on users.id=teacher.user_id'
    try {
         const[result]= await pool.query(query)
        res.json(result)
    } catch (error) {
        res.send(error.message)
    }
}