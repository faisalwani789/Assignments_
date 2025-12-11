import { userData  } from '../utils/userData.js'
import { v4 as uuidv4 } from 'uuid'
export const createUser = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const user = userData.find(user => user.email === email)
        if(user)return res.status(400).send('user already exists')
        const newUser = { id: uuidv4(), name, email, password }
        userData.push(newUser)
        res.status(201).json({ newUser })
    } catch (error) {
        res.status(500).send(error.message)
    }
}
     

export const getUsers = async (req, res) => {
    try {
        // console.log(userData.indexOf(0))
        res.status(200).json({userData})

    } catch (error) {
          res.status(500).send(error.message)
    }
    
}
export const getUser = async (req, res) => {
    const  {id}=req.params
    try {
        const user = userData.find(user => user.id === id)
          if(user===-1) return res.status(500).send("no used found")
        res.status(200).json({ success: true, user })
    } catch (error) {
        res.status(500).send(error.message)
    }
}
export const editUser = async (req, res) => {
     const {id} = req.params
    try {
        let user = userData.findIndex(user => user.id === id)
        if(user===-1) return res.status(500).send("no used found")
    //    userData={id,...req.body}
        // user.id=id
        userData[user]={id,...req.body}
        
        res.status(200).json({ success: true, user })
    } catch (error) {
        res.status(500).send(error.message)
    }
}
export const deleteUser = async (req, res) => {
      const id = req.params.id
      console.log(req.params.id)
     
    try {
        const user = userData.findIndex(user => user.id === id)
        if(user===-1) return res.status(500).send("no used found")
        const deletedUser=userData.splice(user,1)   
        res.status(200).json({ success: true, deletedUser })
    } catch (error) {
        res.status(500).send(error.message)
    }
}