import pool from "../config/db.config.js"

export const upsertUser = async (req, res) => {
    const { id, first_name,last_name, email,role,password,roll_no,class_id } = req.body
    const query1 = 'INSERT INTO users (first_name,last_name,email,password,role) VALUES(?,?,?,?,?)'
    const query2 = 'UPDATE users SET first_name=?, last_name=?, WHERE id = ?'
    
    try {
        if (req.body?.id) {
            //update user
            const [result] = await pool.query(query2, [first_name,last_name,id])
            console.log(result)
            if (result.affectedRows === 0) throw new Error("something went wrong")
            return res.status(200).json({result,message:"user updated successfully"})

        }
        else {
            //create user
            const [exists] = await pool.query('select id from users where email=?', [email])
            if (exists.length > 0) return res.status(400).send('user already exists')
            const [result] = await pool.query(query1, [first_name,last_name, email,password,role])
           
            const insertId=result.insertId
            const[rows]=await pool.query('select * from users where id=?',[insertId])
            console.log(rows)
            if(rows[0].role==='student'){
                //add student
                const [result]=await pool.query('insert into student(user_id ,roll_no,class_id) values (?,?,?)',[insertId,roll_no,class_id])
                return res.status(201).send('student created successfully')
            }
            else{
                //add teacher
                const[result]=await pool.query('insert into teacher(user_id) values(?)',[insertId])
                res.status(201).send('teacher added successfully')
            }
            
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}