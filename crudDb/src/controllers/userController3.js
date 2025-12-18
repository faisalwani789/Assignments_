import pool from "../config/db.config.js"

export const upsertUser = async (req, res) => {
    const { id, first_name,last_name, email,role_id,password,roll_no,class_id,classes } = req.body
    //class_id for student and classes for teacher
    
    const query1 = 'INSERT INTO users (first_name,last_name,email,password,role_id) VALUES(?,?,?,?,?)'
    const query2 = 'UPDATE users SET first_name=?, last_name=? ,email  WHERE id = ?'
    
    try {
        if (req.body?.id) {
             //update user
            const [result] = await pool.query(query2, [first_name,last_name,email,id])
            console.log(result)
            if (result.affectedRows === 0) throw new Error("something went wrong")
            // return res.status(200).json({result,message:"user updated successfully"})
            if(role_id===1){
                //update student
                //do i need to update  class id/ subject for student
                const[rows]=await pool.query('update student set roll_no=?, class_id=? where id=?'[roll_no,class_id,id])
                return res.status(201).json({message:"student updated successfully"})
            }
            else{
                //update teacher
                // const subject_id=subject_ids.split(',')
                // const class_ids_tr=class_id.split(',')
                // const subjectIds=subject_id.map(x=>[parseInt(x),id])
                // const classIds=class_ids_tr.map(x=>[parseInt(x),id])
                // const[rows]=await pool.query('update teacher_classes set class_id=? where id=?'[classIds])
                // const[rows2]=await pool.query('update teacher_subjects set subject_id=? where id=?'[subjectIds])
                return res.status(201).json({message:"teacher updated successfully"})
            }
           

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
                // const subject_id=subject_ids.split(',')
                // const class_ids_tr=class_id.split(',')
                const teacher_id=result.insertId
                // const subjectIds=subject_id.map(x=>[parseInt(x),teacher_id])
                // const classIds=class_ids_tr.map(x=>[parseInt(x),teacher_id])
                const classeIds=[];
                for(const x of classes){
                    const{class_id,subject_id}=x;

                    for(const y of subject_id){
                        classeIds.push([teacher_id,class_id,y])
                    }
                }
                // classes.map(x=>[teacher_id,x.class_id,...x.subject_id]);

                
                // return res.json(classIds)
                // const[rows]=await pool.query('insert into teacher_subjects (subject_id,teacher_id) values ?',[subjectIds])
                // const[rows2]=await pool.query('insert into teacher_classes(class_id,teacher_id) values ?',[classIds])
                const[row3]=await pool.query('insert into teacher_subject_classes(teacher_id, tr_classes,tr_subjects) values ?',[classeIds])
                res.status(201).send('teacher added successfully')
            }
            
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getUsers=async(req,res)=>{
    //  const query='select * , null as joining_date from users left join student on users.id=student.user_id union select users.first_name,users.last_name,users.id,users.email,users.password,role_id , teacher.id , user_id,null,null,joining_date from users left join teacher on users.id=teacher.user_id'
    const q1='select * from users left join student on users.id=student.user_id'
    const q2='select u.id, count(*)as number_of_classes,JSON_ARRAYAGG( JSON_OBJECT("classId",tc.class_id,"subjects",ts.subject_id)) as classes  from  users u left join teacher t on u.id=t.user_id left join teacher_classes tc on t.id = tc.teacher_id left join teacher_subjects as ts on t.id=ts.teacher_id group by u.id ,tc.teacher_id'
    const q4='select teacher_subject_classes.teacher_id, count(distinct teacher_subject_classes.tr_classes)as number_of_classes,JSON_ARRAYAGG( obj) as classes from(select JSON_OBJECT(teacher_subject_classes.tr_subjects) as obj from users left join teacher on users.id=teacher.user_id left join teacher_subject_classes on teacher.id =teacher_subject_classes.teacher_id group by teacher_subject_classes.teacher_id)t2'
    try {
        const[result]= await pool.query(q4)
        res.json(result)
    
    } catch (error) {
        res.send(error.message)
    }
}

