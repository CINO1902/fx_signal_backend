const express = require("express");
const router = express.Router();
const signals = require('../model/createSignal')
const copyModel = require("../model/copyModel");
const sendFCMNotification = require('../route/notification')
var request = require('request');
const crypto = require("crypto");

function generateRandomID() {
  return crypto.randomInt(100000, 999999).toString();
}


router.route('/createSignal').post(async (req,res)=>{
    const {signal_name, signal_type, stop_loss,take_profit, access_type, entry,order} = req.body;

     let date = new Date();
     try{
         let getid =  await signals.find({signal_name: signal_name , active: true});
         if(getid.length != 0){
           return res.json({status:"fail", msg:"Signal Already Exist"})
         }else{
          let signal_id = generateRandomID(); // Generate initial ID

          // Keep generating a new ID until a unique one is found
          while (await signals.findOne({ where: { id: signal_id } })) {
            signal_id = generateRandomID();
          }
          sendNotificationToAllUsers('New Signal!!!', `There is a potential ${order} order on ${signal_name} click to see more details`);
           await signals.create({
            id: signal_id,
            signal_name:signal_name,
               signal_type: signal_type, 
               stop_loss:stop_loss,
               entry:entry,
               order:order,
               active:true,
               take_profit:take_profit,
               access_type:access_type,
               date_created:date    
           }).then( async()=>{ 
             return  res.status(201).json({status:"success", msg:"Signal Created"})
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


  router.route('/getSignals').post(async (req,res)=>{
   const {userId} = req.body;
   console.log(userId)
     try{
         let getSignals =  await signals.find({}).sort({ date_created: -1 });
         if(getSignals.length == 0){
           return res.status(200).json({status:"empty", msg:"There are no signals found", signals:getSignals})
         }else{
          const enrichedCopyTrades = await Promise.all(
            getSignals.map(async (signal) => {
                // Find related data in another collection using signal_id or another field
                const relatedData = await copyModel.findOne({signal_id: signal.id, user_id:userId });
                console.log(relatedData)

                return {
                    ...signal.toObject(), // Convert Mongoose document to plain object
                    copyTraded: !!relatedData, // Attach related data (or null if not found)
                };
            })
        );
            return res.status(200).json({status:"success", msg:"Successful", signals:enrichedCopyTrades})
         }
       }catch(err){
         console.error(err)
          return res.json({status:"fail", msg:"something went wrong"})
       }
  })

  router.route('/getSignalsAdmin').get(async (req,res)=>{
      try{
          let getSignals =  await signals.find({}).sort({ date_created: -1 });
          if(getSignals.length == 0){
            return res.status(200).json({status:"empty", msg:"There are no signals found", signals:getSignals})
          }else{
       
             return res.status(200).json({status:"success", msg:"Successful", signals:getSignals})
          }
        }catch(err){
          console.error(err)
           return res.json({status:"fail", msg:"something went wrong"})
        }
   })


   router.route('/updateSignalAdmin').post(async (req, res) => {
    const { entries, active, signalId , final_price, pair, order, stop_loss, take_profit} = req.body;
    console.log(pair)

    try {
      let date = new Date();
        let getSignals = await signals.findOne({ id: signalId });

        if (!getSignals) {
            return res.status(404).json({ status: "empty", msg: "There are no signals found", signals: getSignals });
        }

        // Construct the update object dynamically
        let updateData = {};
        if (entries !== null && entries !== undefined) {
            updateData.entries = entries;
        }
        if (active !== null && active !== undefined) {
            updateData.active = active;
            if(active == false){
              updateData.date_completed = date
            }
        }
        if (final_price !== null && final_price !== undefined) {
          updateData.final_price = final_price;
      }
      if (pair !== null && pair !== undefined) {
        updateData.signal_name = pair;
    }
    if (order !== null && order !== undefined) {
      updateData.order = order;
   }
  if (stop_loss !== null && stop_loss !== undefined) {
    updateData.stop_loss = stop_loss;
    }
    if (take_profit !== null && take_profit !== undefined) {
      updateData.take_profit
       = take_profit;
      }

        if (Object.keys(updateData).length > 0) {
            getSignals = await signals.findOneAndUpdate(
                { id: signalId },
                { $set: updateData },
                { new: true } // Return the updated document
            );
        }

        return res.status(200).json({ status: "success", msg: "Updated successfully", signals: getSignals });

    } catch (err) {
        console.error(err);
        return res.json({ status: "fail", msg: "Something went wrong" });
    }
});

  
  router.route('/callprice').get(async (req,ress)=>{

// replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
var url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=EURUSD&apikey=ARGK2T9DQOA6LKQC';

request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // data is successfully parsed as a JSON object:
      console.log(data);
      return  ress.json({status:"fail", msg:data})
    }
});
  })


  async function updatePrice() {


  }
  
  module.exports = router