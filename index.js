const express = require("express");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const router = require("./route/register");
const login = require("./route/login");
const emailOTP = require("./route/sendOtp");
const cors = require('cors');
const app = express();
require('dotenv').config();

mongoose.connect("mongodb+srv://new_db:newdb1902@cluster0.9ll3qel.mongodb.net/FX_Signal_Trading"
).then(() => console.log("Db Connected")).catch(()=> console.log("Database error"));
app.use(cors())
app.use(express.json());
app.use("/route",router);
app.use("/route",login);
app.use("/route",emailOTP);
app.route("/").get((req,res)=>{
res.json("hello world");
});



app.listen(port, "0.0.0.0",()=>{
    
    console.log("running in at "+port)
})