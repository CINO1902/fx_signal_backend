const express = require("express");
const router = express.Router();
const pairprice = require("../model/pairprice");


router.route('/getprices').get(async (req,res)=>{
    try {
      let prices = await pairprice.find({});
      if (prices.length === 0) {
        res.status(200).json({ status: "empty", msg: "No signals found", pricesList: prices });
      } else {
        res.status(200).json({ status: "success", msg: "Successful", pricesList: prices });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "fail", msg: "Something went wrong" });
    }

})


router.route('/getpricesPair').post(async (req,res)=>{
    const{pair} = req.body
    try {
      let prices = await pairprice.findOne({pair:pair});
      if (!prices) {
        res.status(404).json({ status: "empty", msg: "No signals found", pricesList: {} });
      } else {
        res.status(200).json({ status: "success", msg: "Successful", pricesList: prices });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "fail", msg: "Something went wrong" });
    }

})
module.exports = router