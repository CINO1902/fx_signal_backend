const express = require("express");
const router = express.Router();
const commentModel = require('../model/comment')
const crypto = require("crypto");


function generateRandomID() {
    return crypto.randomInt(100000, 999999).toString();
  }

router.route('/createComment').post(async (req,res)=>{
    const {firstname, lastname, comment,image_url, signal_id} = req.body;
     let date = new Date();
     try{
          let comment_id = generateRandomID(); // Generate initial ID
          // Keep generating a new ID until a unique one is found
          while (await commentModel.findOne({ where: { id: comment_id } })) {
            signal_id = generateRandomID();
          }
           await commentModel.create({
            id: comment_id,
            firstname:firstname,
            lastname: lastname, 
            signal_id:signal_id,
            comment:comment,
            image_url:image_url,
            date_created:date    
           }).then( async(newComment)=>{ 
             return  res.status(201).json({status:"success", msg:"Comment  Created", data: newComment})
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


  router.route('/callcomments').post(async (req,res)=>{
    const {signal_id} = req.body;
     try{
          // Keep generating a new ID until a unique one is found
       let comment =  await commentModel.find({ signal_id: signal_id } )
            if (comment.length == 0) {
                res.status(404).json({ status: "empty", msg: "No Comment found", comment: {} });
              } else {
                res.status(200).json({ status: "success", msg: "Successful", comment: comment });
              }    
       }catch(err){
         console.error(err)
          return res.json({status:"fail", msg:"something went wrong"})
       }
  })

  module.exports = router