const validation=(req,res,next)=>{
    const{name,email,password}=req.body
    if(!name || !email || !password  ){
        return res.status(400).send("name , email ,password can't be empty")
    }
    if(Object.keys(req.body).length > 3)return res.status(400).send("extra entries not allowed")
    next()
}
export default validation