const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const register = require('../model/register')
const {createTokens} = require('../jwt/middleware')

router.route('/createaccount').post(async (req,res)=>{
  const {firstname, lastname, email,phone_number, password,country} = req.body;
  let emailuse = email.toLowerCase().trim();
   let date = new Date();
   try{
       let getid =  await register.find({email: emailuse});
       if(getid.length != 0){
    
         return res.json({status:"fail", msg:"User Already Exist"})
       }else{
           const accessToken = createTokens(email)
           
        let hashpassword = await bcrypt.hash(password,10)
         await register.create({
             firstname:firstname,
             lastname:lastname,
             email: emailuse, 
             email_verify:false,
             image_url:"",
             allownotification:false,
             trading_experience:"Beginner",
             country:country,
             phone_number:phone_number,
             password:hashpassword,
             token:accessToken,
             
             date:date    
         }).then( async()=>{ 
           return  res.status(201).json({status:"success", msg:"Dashboard Created", token:accessToken})
         }).catch((err)=>{
             if(err){
               console.error(err)
               return  res.status(500).json({status:"fail", msg:"something went wrong"})
             }
         })
       }
     }catch(err){
       console.error(err)
        return res.json({status:"fail", msg:"something went wrong"})
     }
})

module.exports = router