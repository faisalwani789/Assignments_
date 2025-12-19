import {PrismaClient} from '@prisma/client'
const prisma=new PrismaClient()
async function main() {
    const user=await prisma.user.create({
        data:{
            name:'yeb',
            email:"eeb@gmail.com"
        }
    })
    console.log(user)

}
main().catch(console.error).finally(()=>prisma.$disconnect())