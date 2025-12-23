
import { prisma } from "../../lib/prisma.js"
import bcrypt from 'bcrypt'
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                teacher: {
                    teacherClasses: {
                        some: {
                            isActive: true
                        }
                    }
                }
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                teacher: {
                    select: {
                        teacherClasses: {
                            where: {
                                isActive: true,
                                teacherclassSubjects: {
                                    some: {
                                        isActive: true
                                    }
                                }
                            },
                            select: {
                                id: true,
                                class: {
                                    select: {
                                        id: true,
                                        className: true
                                    }
                                },
                                teacherclassSubjects: {
                                    where: {
                                        isActive: true
                                    },
                                    select: {
                                        id: true,
                                        subject: {
                                            select: {
                                                id: true,
                                                subjectName: true
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
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
        await prisma.$transaction(async (tx) => {
            if (req.body?.id) {

                //update user
                const user = await tx.user.findUnique({ where: { id: id } })
                if (!user) return res.status(400).send('user does not exist')


                const updateUser = await tx.user.update({
                    where: { id: id },
                    data: {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,

                    },
                    select: {
                        role: true,
                        id: true
                    }
                })

                if (updateUser.role === "student") {
                    const studet = await tx.student.findUnique({ where: { user_id: id } })
                    if (!studet) return res.status(400).send('student does not exist')
                    const updateStudent = await tx.student.update({
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
                    const teacher = await tx.teacher.findUnique({ where: { user_id: id } })
                    if (!teacher) res.status(400).send('teacher does not exist')


                    await tx.teacherClasses.updateMany({
                        where: { teacher_id: teacher.id },
                        data: { isActive: false }

                    })

                    const teacherClassIds = await tx.teacherClasses.findMany({
                        where: { teacher_id: teacher.id },
                        select: { id: true }
                    })


                    if (teacherClassIds.length) {
                        await tx.teacherClassesSubject.updateMany({
                            where: {
                                teacherClassId: {
                                    in: teacherClassIds.map(tc => tc.id)
                                }
                            },
                            data: { isActive: false }
                        })
                    }




                    for (const tcr of classes || []) {
                        const TrClassId = await tx.teacherClasses.upsert({
                            where: {
                                teacher_id_class_id: {
                                    teacher_id: teacher.id,
                                    class_id: tcr.class_id
                                }

                            },
                            update: {
                                isActive: true
                            },
                            create: {
                                teacher_id: teacher.id,
                                class_id: tcr.class_id
                            }
                        })

                        for (const sub of tcr.subjects || []) {
                            await tx.teacherClassesSubject.upsert({
                                where: {
                                    teacherClassId_subject_id: {
                                        teacherClassId: TrClassId.id,
                                        subject_id: sub
                                    }

                                },
                                update: {
                                    isActive: true
                                },
                                create: {
                                    teacherClassId: TrClassId.id,
                                    subject_id: sub
                                }
                            })
                        }
                    }

                    return res.status(201).json({ message: "teacher updated successfully" })
                }
            }

            else {
                //create user

                const user = await tx.user.findUnique({ where: { email: email } })
                if (user) return res.status(400).send('user already exists')
                const passwordHash = await bcrypt.hash(password, 10)
                const newUser = await tx.user.create({
                    data: {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        role: role,
                        password: passwordHash
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
                        for (const tcr of classes) {
                            console.log(tcr.class_id)
                            const TrClassId = await tx.teacherClasses.create({
                                data: {
                                    teacher: {
                                        connect: {
                                            id: newTeacher.id
                                        }
                                    },
                                    class: {
                                        connect: {
                                            id: tcr.class_id
                                        }
                                    }
                                }
                            })
                            await tx.teacherClassesSubject.createMany({
                                data: tcr?.subjects.map(sub => ({ teacherClassId: TrClassId.id, subject_id: sub }))
                            })
                        }
                        return res.status(201).json({ msg: 'teacher added successfully with subjects', })
                    }

                    res.status(201).send('teacher added successfully without subjects')
                }

            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}


export const getUser = async (req, res) => {
    const { id } = req.body
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
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


