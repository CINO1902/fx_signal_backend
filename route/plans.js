const express = require("express");
const router = express.Router();
const plans = require('../model/plans');
const crypto = require("crypto");
const axios = require('axios')
const userPlans = require("../model/userPlan");
const Users = require("../model/register");
const mongoose = require('mongoose');
const { validateToken } = require("../jwt/middleware");
const { sendOTPEmail } = require('../utils/sendmail');
function generateRandomID() {
    return crypto.randomInt(100000, 999999).toString();
  }
  

router.route('/createPlan').post(async (req, res) => {
    const { planName, planPrice, planPrivielege} = req.body;
    let date = new Date();
    try {
        let plan_id = generateRandomID();
        while (await plans.findOne({ where: { id: plan_id } })) {
            plan_id = generateRandomID();
          }
          await plans.create({
            id: plan_id,
            planName:planName,
            planPrice: planPrice, 
            planPrivielege:planPrivielege,
            date_created:date    
           }).then(async()=>{
            return  res.status(201).json({status:"success", msg:"Plan Created"})
           }).catch((err)=>{
            if(err){
                console.error(err)
                return  res.status(500).json({status:"fail", msg:"something went wrong"})
              }
           }) 
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  router.route('/getPlan').get(async (req, res) => {
    try {
        let getPlan = await plans.find().sort({ planPrice: 1 });
        if (getPlan.length === 0) {
            return res.status(404).json({ status: "empty", msg: "There are no plans found", plans: null });
        }
        // Find related data for the single signal
        return res.status(200).json({ status: "success", msg: "Successful", plans: getPlan });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  router.route('/checkActivePlan').get(validateToken, async (req, res) => {
    const userId = req.decoded.userId;
  
    try {
      const objectId = new mongoose.Types.ObjectId(userId);
      const user = await Users.findById(objectId).populate('plan');
  
      if (!user || !user.plan) {
        return res.status(200).json({
          status: 'no_plan',
          msg: 'You have no active plan.',
          hasActivePlan: false,
        });
      }
  
      const currentDate = new Date();
      const planExpiry = new Date(user.plan.date_expired);
  
      if (planExpiry > currentDate) {
        return res.status(200).json({
          status: 'active',
          msg: 'You already have an active plan.',
          hasActivePlan: true,
          plan: user.plan
        });
      } else {
        return res.status(200).json({
          status: 'expired',
          msg: 'Your previous plan has expired.',
          hasActivePlan: false,
          plan: user.plan
        });
      }
    } catch (error) {
      console.error("Error checking active plan:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  router.route('/buyPackage').post( async (req, res) => {
    const { reference, email} = req.body;

    try {
      console.log(reference)
      // Check if the reference is purely numeric (i.e. contains no alphabetic characters)
      // Check if the reference looks like a Paystack reference (e.g., doesn't contain "_")
    if (!reference.includes('_')) {
      // If it's likely a Paystack reference, verify the transaction
      const verificationResponse = await verifyTransaction(reference);
      console.log(reference)
      if (
        !verificationResponse.data ||
        !verificationResponse.data.data ||
        verificationResponse.data.data.status !== 'success'
      ) {

        return res.status(400).json({
          status: "failed",
          msg: "Transaction verification failed",
          verification: verificationResponse.data
        });
      }else{
        await sendOTPEmail(emailUse, finalOtp);
        return res.status(400).json({
          status: "success",
          msg: "Transaction verification Successfully",
          verification: verificationResponse.data
        });
      }
    }}catch(error){
      console.error("Error processing buyPlan:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  })

  
  router.route('/buyPlan').post(validateToken, async (req, res) => {
    const userId = req.decoded.userId;
    const { id, reference } = req.body; // assuming `reference` is passed in the body
  
    try {
      console.log(reference)
      // Check if the reference is purely numeric (i.e. contains no alphabetic characters)
      // Check if the reference looks like a Paystack reference (e.g., doesn't contain "_")
    if (!reference.includes('_')) {
      // If it's likely a Paystack reference, verify the transaction
      const verificationResponse = await verifyTransaction(reference);
      console.log(reference)
      if (
        !verificationResponse.data ||
        !verificationResponse.data.data ||
        verificationResponse.data.data.status !== 'success'
      ) {

        return res.status(400).json({
          status: "failed",
          msg: "Transaction verification failed",
          verification: verificationResponse.data
        });
      }
    }
      // Proceed with the buyPlan endpoint functionality
  
      const objectId = new mongoose.Types.ObjectId(userId);
      const currentDate = new Date();
      const dateExpired = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  
      const getPlan = await plans.findOne({ id: id });
      if (!getPlan) {
        return res.status(404).json({ 
          status: "empty", 
          msg: "There are no plans found", 
          plans: null 
        });
      }
  
      const userPlan = await userPlans.create({
        id: getPlan.id,
        planName: getPlan.planName,
        user_id: objectId,
        reference: reference,
        planPrice: getPlan.planPrice,
        planPrivielege: getPlan.planPrivielege,
        date_bought: currentDate,
        date_expired: dateExpired,
      });
  
      await Users.findByIdAndUpdate(objectId, { plan: userPlan._id });
  
      return res.status(200).json({ 
        status: "success", 
        msg: "Plan purchased successfully", 
        plans: userPlan 
      });
    } catch (error) {
      console.error("Error processing buyPlan:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Function to verify a transaction with Paystack
  async function verifyTransaction(reference) {
    try {
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      });
      return response;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
    
  
  


module.exports = router