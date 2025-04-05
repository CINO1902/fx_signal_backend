const express = require("express");
const router = express.Router();
const plans = require('../model/plans');
const crypto = require("crypto");


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
        if (!getPlan) {
            return res.status(404).json({ status: "empty", msg: "There are no plans found", plans: null });
        }
        // Find related data for the single signal
        return res.status(200).json({ status: "success", msg: "Successful", plans: getPlan });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


module.exports = router