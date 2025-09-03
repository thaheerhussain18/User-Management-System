const jwt=require('jsonwebtoken');

const secret = "admin@r__t";

const authToken=((req,res,next)=>{
    // console.log(req.headers)
    const authHeader=req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]
    if(token==null){
        return res.json({message:"token is required"})
    }
    jwt.verify(token,secret,(err,user)=>{
        if(err){
            return res.json({ message: 'Invalid or expired token' })
        }
        req.user=user
        next()
    })
})

module.exports={authToken,secret}