import { prisma } from "../../lib/prisma.js"
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                student: true,
                teacher: true
            },
        });
        res.json(users)
    } catch (error) {
        res.send(error.message)
    }
}
export const addUser = async (req, res) => {
    const { id, first_name, last_name, email, role, password, roll_no, class_id, classes } = req.body
    try {
        if (req.body?.id) {
            //update user
            const user = await prisma.user.findUnique({ where: { id: id } })
            if (!user) return res.status(400).send('user does not exist')
            const updateUser = await prisma.user.update({
                where: { id: id },
                data: {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password
                },
                select: {
                    role: true,
                    id: true
                }
            })

            // return res.status(200).json({result,message:"user updated successfully"})
            if (updateUser.role === "student") {
                const studet = await prisma.student.findUnique({ where: { user_id: id } })
                if (!studet) return res.status(400).send('student does not exist')
                const updateStudent = await prisma.student.update({
                    where: { user_id: id },
                    data: {
                        class_id: class_id,
                        roll_no: roll_no
                    },
                    select: {
                        roll_no
                    }
                })
                return res.status(201).json({ message: "student updated successfully" })
            }
            else {
                const teacher = await prisma.teacher.findUnique({ where: { user_id: id } })
                if (!teacher) res.status(400).send('teacher does not exist')
                const teacherArr = []
                for (const cx of classes) {
                    const { class_id, subjects } = cx
                    for (const subject_id of subjects) {
                        teacherArr.push({
                            teacherId: teacher.id,
                            class_id: class_id,
                            subject_id: subject_id
                        })
                    }
                    await prisma.teacherClassesSubject.deleteMany({
                        where: { teacherId: teacher.id }
                    })
                    const updateUser = await prisma.teacherClassesSubject.createMany({
                        data: teacherArr //update issues
                    })

                    return res.status(201).json({ message: "teacher updated successfully" })
                }

            }
        }

        else {
            //create user
            await prisma.$transaction(async (tx) => {
                const user = await tx.user.findUnique({ where: { email: email } })
                if (user) return res.status(400).send('user already exists')
                const newUser = await tx.user.create({
                    data: {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        role: role,
                        password: password
                    },
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                })

                if (newUser.role === 'student') {
                    //add student
                    const newStudent = await tx.student.create({
                        data: {
                            roll_no: roll_no,
                            user_id: newUser.id,
                            class_id: class_id
                        },
                        select: {
                            roll_no: true
                        }
                    })
                    return res.status(201).send(`student with roll no ${newStudent.roll_no}created successfully`)
                }

                else {
                    //add teacher
                    const newTeacher = await tx.teacher.create({
                        data: {
                            user_id: newUser.id,
                        },
                        select: {
                            id: true
                        }
                    })

                    if (req.body?.classes) {
                        //add subject class details to teacher
                        const teacherArr = []
                        for (const cx of classes) {
                            const { class_id, subjects } = cx
                            for (const subject_id of subjects) {
                                teacherArr.push({
                                    teacherId: newTeacher.id,
                                    class_id: class_id,
                                    subject_id: subject_id
                                })
                            }
                        }
                        const subClasses = await tx.teacherClassesSubject.createMany({
                            data: teacherArr
                        })

                        // console.log(subClasses, teacherArr)
                        return res.status(201).json({ msg: 'teacher added successfully with subjects', })
                    }

                    res.status(201).send('teacher added successfully without subjects')
                }


            })
        }

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const getUser=async(req,res)=>{
    const{id}=req.body
    try {
         const user = await prisma.user.findUnique({
            where:{
                id:id
            },
            include: {
                student: true,
                teacher: true
            },
        });
        res.json(user)
    } catch (error) {
         res.status(500).send(error.message)
    }
}
