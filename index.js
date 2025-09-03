const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator=require('validator')
const {authToken,secret}=require("./jwt")
const db = require("./db");   
const app = express();


app.use(express.json());


app.post('/register',async (req,res)=>{
    const {firstName,lastName,email,password}=req.body
    if(!firstName || !lastName || !email || !password){
        return res.status(400).json({'message':"all fields is needed"})
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({'message':"email is invalid"})
    }

    try{
    const [row]=await db.execute("select * from users where email=?",[email])
        // console.log( row)
        if(row.length>0){
            return res.json({message:"duplicate record fund"})
        }
    const HashedPass=await bcrypt.hash(password,12)
    await db.execute("insert into users(email,firstName,lastName,password) values(?,?,?,?)",[email,firstName,lastName,HashedPass])
        return res.status(201).json({ message: "Registered successfully" });
    }
    catch(err){
        return res.json({message:err})
    }
})

app.post('/login',async (req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(400).json({message:"invalid data or credentails"})
    }
    // console.log(await db.execute('select password from users where email=?',[email]))
   const [rows] = await db.execute("SELECT * FROM users WHERE email=?",[email]);
    if(rows.length===0){
        return res.status(404).json({message:"record not found"})
    }
    const hashPass =rows[0].password
    const matchCred=await bcrypt.compare(password,hashPass)
    if(matchCred){
        // return res.status(201).json({message:"Credentials matched"})
        const user =rows[0]
        const token=jwt.sign({id:user.id,email:user.email},secret)
        return res.status(200).json({message:token})
    }
    else{
        return res.status(400).json({message:"Credentials invalid"})
    }

})


//for geting users after getting token
app.get('/users',authToken, async (req,res)=>{
    try{
        const [rows] = await db.execute("select id,email,firstName,lastName from users")
        return res.json(rows)
    }
    catch(err){
       return  res.status(500).json({message:"server error"})
    }
})

app.put('/users/:id',authToken,async(req,res)=>{
    try{
        const {id} = req.params
        const {firstName,lastName}=req.body

        if(!firstName || !lastName){
            res.status(400).json({message:"error occured check updated data"})
        }
        else if(parseInt(id)!==req.user.id){
            console.log("id not matched with the token ")
            return res.status(403).json({message:"id not matched"})
        }
        else{
            await db.execute("update users set firstName=? ,lastName=? where id=?",[firstName,lastName,id])

            return res.status(200).json({message:"updated"})
        }
    }
    catch(err){
        return res.json({message:err})
    }
})

app.delete('/users/:id',authToken,async(req,res)=>{
    try{
        const {id} = req.params

        if(!id){
            res.status(400).json({message:"error occured check id"})
        }
        else if(parseInt(id)!==req.user.id){
            console.log("id not matched with the token ")
            return res.status(403).json({message:"id not matched"})
        }

        else {
            await db.execute("delete from users where id=?",[id])

            return res.status(200).json({message:"deleted"})
        }
    }
    catch(err){
        return res.json({message:err})
    }
})


app.listen(5000,console.log("server started"))
