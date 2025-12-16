import pool from "../config/db.config.js"

export const upsertUser = async (req, res) => {
    const { id, first_name,last_name, email,role_id,password,roll_no,class_id,subject_ids } = req.body
    
    
    const query1 = 'INSERT INTO users (first_name,last_name,email,password,role_id) VALUES(?,?,?,?,?)'
    const query2 = 'UPDATE users SET first_name=?, last_name=? ,email  WHERE id = ?'
    
    try {
        if (req.body?.id) {
            //update user
            const [result] = await pool.query(query2, [first_name,last_name,email,id])
            console.log(result)
            if (result.affectedRows === 0) throw new Error("something went wrong")
            return res.status(200).json({result,message:"user updated successfully"})

        }
        else {
            //create user
            const [exists] = await pool.query('select id from users where email=?', [email])
            if (exists.length > 0) return res.status(400).send('user already exists')
            const [result] = await pool.query(query1, [first_name,last_name, email,password,role_id])
           
            const insertId=result.insertId
            const[rows]=await pool.query('select * from users where id=?',[insertId])
            console.log(rows)
            if(rows[0].role_id===1){
                //add student
                const [result]=await pool.query('insert into student(user_id ,roll_no,class_id) values (?,?,?)',[insertId,roll_no,class_id])
                return res.status(201).send('student created successfully')
            }
            else{
                //add teacher
                const[result]=await pool.query('insert into teacher(user_id) values(?)',[insertId])
                // console.log(result)
                const subject_id=subject_ids.split(',')
                const class_ids_tr=class_id.split(',')
                const teacher_id=result.insertId
                const subjectIds=subject_id.map(x=>[parseInt(x),teacher_id])
                const classIds=class_ids_tr.map(x=>[parseInt(x),teacher_id])
                
                const[rows]=await pool.query('insert into teacher_subjects (teacher_id, subject_id) values ?',[subjectIds])
                const[rows2]=await pool.query('insert into teacher_classes(teacher_id,class_id) values ?',[classIds])
                res.status(201).send('teacher added successfully')
            }
            
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getUsers=async(req,res)=>{
     const query='select * from users left join student on users.id=student.user_id union select *, null,null from users left join teacher on teacher.user_id=users.id   '
    try {
        const[result]= await pool.query(query)
        res.json(result)
    
    } catch (error) {
        res.send(error.message)
    }
}

