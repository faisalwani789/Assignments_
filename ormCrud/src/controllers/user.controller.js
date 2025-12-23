
import { prisma } from "../../lib/prisma.js"
export const getUsers = async (req, res) => {
    try {
        const users= await prisma.user.findMany({
           include:{
            student:true,
            teacher:{

                include:{
                    teacherClasses:{
                        include:{
                            teacherclassSubjects:{
                                include:{
                                    subject:true
                                }
                            }
                        }
                    }
                },
                
            },
        
           } 
        })
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
                const teacherClass=[]
                const teacherSubjects=[]
                    await prisma.teacherClasses.updateMany({
                        where: { 
                            teacher_id: teacher.id,
                         },
                        data:{
                            isActive:false
                        }
                    })
                    await prisma.teacherClasses.updateMany({
                        where:{
                            teacher_id:teacher.id,
                            class_id:{in:[...teacherClass]}
                        },
                        data:{
                            isActive:true
                        }
                    })

                     await prisma.teacherClasses.createMany({
                            //add if not available
                            data:teacherClass.map(x=>({teacher_id:teacher.id,class_id:x,isActive:true})),
                            skipDuplicates:true
                        })

                    return res.status(201).json({ message: "teacher updated successfully" })
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
                    //     const teacherArr = []
                    //     const teacherClass=[]
                    //     const teacherSubs=[]

                      
                    //      for(const cx of classes){
                    //     teacherClass.push({teacher_id:newTeacher.id,class_id:cx.class_id})
                    // }
                    //     for (const cx of classes) {
                    //         const { class_id, subjects } = cx
                    //         for (const subject_id of subjects) {
                    //             teacherSubs.push({
                    //                 teacher_id:newTeacher.id,
                    //                 subject_id:subject_id
                    //             })
                    //             teacherArr.push({
                    //                 teacherId:newTeacher.id,
                    //                 class_id: class_id,
                    //                 subject_id: subject_id
                    //             })
                    //         }
                    //     }
                        // console.log(teacherArr)


                        for(const tcr of classes){
                            console.log(tcr.class_id)
                            const TrClassId= await tx.teacherClasses.create({
                                data:{
                                   teacher:{
                                    connect:{
                                        id:newTeacher.id
                                    }
                                   },
                                   class:{
                                    connect:{
                                        id:tcr.class_id
                                    }
                                   }
                                }
                             })
                            //  console.log(tcr.subjects)
                            //  console.log(tcr)
                            //  console.log(typeof(tcr.subjects))
                             //bulk insert subjects
                             await tx.teacherClassesSubject.createMany({
                                data:tcr?.subjects.map(sub=>({teacherClassId:TrClassId.id,subject_id:sub}))
                             })
                           
                            
                            //  await tx.teacherClassesSubject.create({
                            //     data:{
                            //         teacherClassId:TrClassId.id,
                            //         subject_id:tcr.subject_id
                            //     }
                            //  })
                        }
                       
                        
                        // return res.json(teacherArr)
                        // const TchClasses = await tx.teacherClasses.createMany({
                        //     data: teacherArr
                        // })
                        // const findTchClasses=await tx.teacherClasses.findMany({
                        //     where:{teacher_id:newTeacher.id},select:{id:true}
                        // })
                        //multiple insert fails as we need to map subjectIs with trClassId

                        return res.status(201).json({ msg: 'teacher added successfully with subjects', })
                    }

                    res.status(201).send('teacher added successfully without subjects')
                }


            })
        }

    } catch (error) {
        console.log(error)
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
