import pool from "../config/db.config.js";

export const addUser = async (req, res) => {
    const { name, email,role,department } = req.body
    if (!name || !email) return res.status(400).send("email & name can't be empty")
    //insert role id + dept Id
    const query = 'INSERT INTO userdata (name,email,dept_id,role_id) VALUES(?,?,?,?)'
    try {
        const[exists]=await pool.query('select id from userdata where email=?',[email])
        if(exists.length > 0) return res.status(400).send('user already exists')

        const [dept] = await pool.query('select id from departments where department = ?', [department])
        const [role_] = await pool.query('select id from roles where role = ?', [role])
        // console.log(deptId[0].id)
        const deptId=dept[0].id
        const roleId=role_[0].id
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
        const query = 'select * from userdata'
        const [user] = await pool.query(query)
        res.status(200).json({ user })
    } catch (error) {
        console.log(error)
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
export const getUser=async(req,res)=>{
    const{id}=req.body
    const q='select * from userdata'
    try {
        const [user]=await pool.query(q)
        res.status(200).json({user})
    } catch (error) {
         res.status(500).send(error.message)
    }
}
export const updateUser = async (req, res) => {
    const { id, email, name } = req.body
    const query = 'UPDATE userdata SET name=?, email=? WHERE id = ?'
    try {
        const [user] = await pool.query(query, [name, email, id])
        res.status(200).json(user)
    } catch (error) {
        res.status(500).send(error.message)
    }
}
