import pool from "../config/db.config.js";
import { deptRoleIds } from "../utils/deptRole.utils.js";

export const addUser = async (req, res) => {
    const { name, email,role,department } = req.body
    if (!name || !email) return res.status(400).send("email & name can't be empty")
    //insert role id + dept Id
    const query = 'INSERT INTO userdata (name,email,dept_id,role_id) VALUES(?,?,?,?)'
    try {
        const[exists]=await pool.query('select id from userdata where email=?',[email])
        if(exists.length > 0) return res.status(400).send('user already exists')

        const{deptId,roleId}=await deptRoleIds(department,role)
        console.log(deptId)
        if(deptId.length == 0 || roleId.length===0){
            return res.status(400).send('enter a valid department & role')
        }
        const [user] = await pool.query(query, [name, email,deptId,roleId])

        res.status(201).json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}
export const getUsers = async (req, res) => {
    try {
        const query = 'select userdata.id,isActive, name, email , department ,role from userdata join departments on userdata.dept_id = departments.id join roles on userdata.role_id=roles.id'
        const [user] = await pool.query(query)
        if(user.length ===0) throw new Error("user not found")
        res.status(200).json({ user })
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

export const getUser=async(req,res)=>{
    const{id}=req.body
    const q='select id,name, email ,isActive, department ,role from (select * from userdata where id=?) as u  join departments on u.dept_id = departments.id join roles on u.role_id=roles.id '
    try {
        const [user]=await pool.query(q,[id])
        if(user.length ===0) throw new Error("user not found")
        res.status(200).json({user})
    } catch (error) {
         res.status(500).send(error.message)
    }
}
export const updateUser = async (req, res) => {
    const { id, email, name,department,role } = req.body
    //update roles and department table also
    const query = 'UPDATE userdata SET name=?, email=?, dept_id=?, role_id=? WHERE id = ?'
    
    try {
        const{deptId,roleId}=await deptRoleIds(department,role)
        const [result] = await pool.query(query, [name, email,deptId,roleId, id])
        if(result.affectedRows===0) throw new Error("something went wrong")
        res.status(200).json(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const blockUser=async(req,res)=>{
    const{id}=req.body
    try { 
        const  q='UPDATE userdata SET isActive=? where id=?'
        const[result]=await pool.query(q,[0,id])
        if(result.affectedRows===0) throw new Error('something went wrong')
        res.status(201).send('blocked')
    } catch (error) {
        
         res.status(500).send(error.message)
    }
}

// export const addRole = async (req, res) => {
//     const { department, role } = req.body

//     const query = 'UPDATE userdata SET dept_id=? , role_id=?'

//     try {
//         const [getDept] = await pool.query('select id from departments where department = ?', [department])
//         const [getRole] = await pool.query('select id from roles where role = ?', [role])
//         console.log(getDept)
//         console.log(getRole)
//         // const[result]=await pool.query(query,[])
//         res.send('done')
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// }