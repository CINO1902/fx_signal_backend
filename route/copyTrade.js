const express = require("express");
const router = express.Router();
const copyModel = require("../model/copyModel");
const signals = require('../model/createSignal')
const crypto = require("crypto");

function generateRandomID() {
    return crypto.randomInt(100000, 999999).toString();
  }
  

router.route('/addCopy').post(async (req,res)=>{
    const {userId, signalId} = req.body;
    try {
        let date = new Date();
        const existingDocument = await copyModel.findOne({ user_id: userId, signal_id: signalId });
        if(existingDocument){
            await copyModel.deleteOne({ _id: existingDocument._id });
          return res.status(200).json({status:"success", msg:"You are already copying this trade", data:{}})
        }else{
         let copyId = generateRandomID(); // Generate initial ID
         // Keep generating a new ID until a unique one is found
         while (await copyModel.findOne({ where: { id: copyId } })) {
            copyId = generateRandomID();
         }
         const newCopy = await copyModel.create({
          id: copyId,
          user_id: userId,
          signal_id: signalId,  
          date_created: date    
      });
  
      // Find related data in another collection using signal_id
      const relatedData = await signals.findOne({ id: newCopy.signal_id });
  
      // Enrich the created document with related data
      const enrichedCopy = {
          ...newCopy.toObject(), // Convert Mongoose document to plain object
          relatedData: relatedData || null // Attach related data (or null if not found)
      };
  
      return res.status(201).json({ status: "success", msg: "Trade Copied Successfully", data: enrichedCopy });
        }
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "fail", msg: "Something went wrong" });
    }

})



router.route('/getCopy').post(async (req, res) => {
    const { userId } = req.body;
    try {
        let userCopies = await copyModel.find({ user_id: userId }).sort({ date_created: -1 });

        if (userCopies.length === 0) {
            return res.status(404).json({ status: "empty", msg: "You are not copying any trade", copyTrade: [] });
        }

        // Loop through each copyTrade and fetch details from another collection
        const enrichedCopyTrades = await Promise.all(
            userCopies.map(async (copy) => {
                // Find related data in another collection using signal_id or another field
                const relatedData = await signals.findOne({ id: copy.signal_id });

                return {
                    ...copy.toObject(), // Convert Mongoose document to plain object
                    relatedData: relatedData || null, // Attach related data (or null if not found)
                };
            })
        );

        res.status(200).json({ status: "success", msg: "Successful", copyTrade: enrichedCopyTrades });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "fail", msg: "Something went wrong" });
    }
});

module.exports = router