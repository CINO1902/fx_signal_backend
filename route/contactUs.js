const express = require("express");
const router = express.Router();
const contact = require('../model/contact')


router.route('/contactUs').post(async (req,res)=>{
    const {firstname, lastname, email,subject, message} = req.body;
     let date = new Date();
     try{
       
          // Keep generating a new ID until a unique one is found
           await contact.create({
            firstname:firstname,
            lastname: lastname, 
            email:email,
            subject:subject,
            message:message,
            date:date    
           }).then(async()=>{ 
             return  res.status(201).json({status:"success", msg:"Message Sent"})
           }).catch((err)=>{
               if(err){
                 console.error(err)
                 return  res.status(500).json({status:"fail", msg:"something went wrong"})
               }
           })     
       }catch(err){
         console.error(err)
          return res.json({status:"fail", msg:"something went wrong"})
       }
  })

  module.exports = router
