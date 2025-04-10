const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer') 
const otpModel = require('../model/otpModel')
const register = require('../model/register')
const { validateToken } = require("../jwt/middleware");
const mongoose = require('mongoose');
const { sendOTPEmail } = require('../utils/sendmail');


router.post("/request-otp", async (req, res) => {
    const { email } = req.body;
    const emailUse = email.toLowerCase().trim();
  
    // Helper functions
    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };
    const getCurrentTimestamp = () => new Date();
    const getExpiryTimestamp = () => new Date(Date.now() + 10 * 60 * 1000);
  
    const finalOtp = generateOTP();
  
    try {
      // Remove any previous OTP for this email
      await otpModel.deleteMany({ email: emailUse });
      
      // Create a new OTP document
      await otpModel.create({
        otp: finalOtp,
        email: emailUse,
        date_created: getCurrentTimestamp(),
        date_expired: getExpiryTimestamp()
      });
    } catch (e) {
      console.error(e);
      return res.json({ status: "fail", message: "Something went wrong while saving OTP" });
    }
  
    try {
      // Use the helper function to send the OTP email
      await sendOTPEmail(emailUse, finalOtp);
      res.status(200).json({ msg: "One time password has been sent to your mail" });
    } catch (e) {
      console.error("Error sending email:", e);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  });


router.post("/verify-otp", async(req,res)=>{
    const {email, otp} = req.body;
    let emailuse = email.toLowerCase().trim();

    console.log(emailuse)
    try{
        let getdocument =  await otpModel.findOne({email: emailuse});
        const now_date = new Date();
        console.log(now_date)


        if(getdocument){
            if(getdocument.date_expired > now_date){
                if(getdocument.otp != otp){
                    return res.status(500).json({status:'fail', message:"The Otp you entered is incorrect"})
                }else{
                    await register.updateOne({email:emailuse},{$set: {email_verify:true}},{upsert:true})
                    await otpModel.deleteMany({email:emailuse})
                    return res.status(200).json({status:'success', message:"Your email has been verified successfully"})
                }
            }else{
                return res.status(500).json({status:'fail', message:"The Otp has been expired, Request a new one"})
            }
        }else{
            return res.status(500).json({status:'fail', message:"Email does not exist"})
        }
       
        
    }catch(e){
        console.error(e)
        return res.json({status:"fail", message:"something went wrong"})
    }

    
})


router.post("/complete-profile", async(req,res)=>{
    const {imageUrl, tradeExperience, allownotification, email} = req.body;
    let emailuse = email.toLowerCase().trim();

    console.log(emailuse)
    try{
        let getdocument =  await register.findOne({email: emailuse});
        if(getdocument){      
        await register.updateOne({email:emailuse},
            {$set: {
            image_url:imageUrl, 
            completed_profile:true,
            trading_experience:tradeExperience,
            allownotification:allownotification
        }},
            {upsert:true})     
        return res.status(200).json({status:'success', message:"Your Profile has been updated"})     
          
        }else{
            return res.status(500).json({status:'fail', message:"Profile does not exist"})
        }  
    }catch(e){
        console.error(e)
        return res.json({status:"fail", message:"something went wrong"})
    }
})


router.route('/updateProfilePicture').post(validateToken, async (req,res)=>{
    let userId = req.decoded.userId  
    console.log(userId)
    const{ imageUrl} = req.body
    try {
      let getdocument = await register.findById(userId);
      if (!getdocument) {
        return res.status(404).json({status:'fail', message:"Profile does not exist"})
      } else {
        const objectId = new mongoose.Types.ObjectId(userId);
        await register.findByIdAndUpdate(objectId,
            {$set: {
            image_url:imageUrl, 
        }},
            {upsert:true})   
        res.status(200).json({ status: "success", msg: "Successful" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "fail", msg: "Something went wrong" });
    }

})

module.exports = router