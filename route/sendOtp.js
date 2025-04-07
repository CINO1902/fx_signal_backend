const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer') 
const otpModel = require('../model/otpModel')
const register = require('../model/register')
const { validateToken } = require("../jwt/middleware");

router.post("/request-otp", async(req,res)=>{
    const{email} = req.body
    let emailuse = email.toLowerCase().trim();
    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
        };

        const getCurrentTimestamp = () => new Date();
        const getExpiryTimestamp = () => new Date(Date.now() + 10 * 60 * 1000);
        const finalOtp = generateOTP()
    try{
        await otpModel.deleteMany({ email }); 
    await otpModel.create({
        otp:finalOtp,
        email:emailuse,
        date_created:getCurrentTimestamp(),
        date_expired:getExpiryTimestamp()
    })
    }catch(e){
        console.error(e)
        return res.json({status:"fail", message:"something went wrong"})
    }
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"caleboruta.co@gmail.com",
            pass:"jrnbecbxpryesqzq"
        }
    })
    const mailOption = {
        from:"caleboruta.co@gmail.com",
        to:email,
        subject:"Email OTP",
        // text:"New Email"
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .otp {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    margin: 20px 0;
                }
                .footer {
                    font-size: 12px;
                    color: #777;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>One-Time Password (OTP) Verification</h2>
                <p>Dear User,</p>
                <p>Your one-time password (OTP) for secure access is:</p>
                <p class="otp">${finalOtp}</p>
                <p>This OTP is valid for <strong>10 minutes</strong> and should not be shared with anyone.</p>
                <p>If you did not request this code, please ignore this email or contact our support team immediately.</p>
                <p class="footer">Best regards, <br> <strong>FX Signal Trade</strong> <br> Contact Us: support@yourcompany.com <br> <a href="https://yourcompany.com">www.yourcompany.com</a></p>
            </div>
        </body>
        </html>
    `
    }

    try{
        await transporter.sendMail(mailOption);
        res.status(200).json({msg:"One time password has been sent to your mail"})
    }catch(e){
        res.status(500).json({msg:"Internal Server Error"})
    }
})


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
        await register.updateOne({email:email},
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