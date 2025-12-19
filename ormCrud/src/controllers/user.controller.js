import { prisma } from "../../lib/prisma.js"
export const getUser=async(req,res)=>{
    try {
        const allUsers = await prisma.user.findMany({})
  res.json(allUsers)
    } catch (error) {
        res.send(error.message)
    }
}
export const addUser=async(req,res)=>{
    try {
       const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
    }
  })
  console.log('Created user:', user)
  res.json(user)
    } catch (error) {
        res.send(error.message)
    }
}