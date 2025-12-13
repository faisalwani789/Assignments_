import pool from "../config/db.config.js"
export const deptRoleIds=async(department,role)=>{
     const [dept] = await pool.query('select id from departments where department = ?', [department])
        const [role_] = await pool.query('select id from roles where role = ?', [role])
        // console.log(deptId[0].id)
        const deptId=dept[0].id
        const roleId=role_[0].id
        return{deptId,roleId}
}