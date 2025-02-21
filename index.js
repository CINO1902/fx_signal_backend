const express = require("express");
const http = require("http");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const router = require("./route/register");
const login = require("./route/login");
const emailOTP = require("./route/sendOtp");
const createSignal = require("./route/createSignal");
const getprices = require("./route/getPrices");
const addComment = require("./route/addComment");
const copyTrade = require("./route/copyTrade");
// const server = require('./route/getPrices')

// const pairPrice = require("./route/getPrices");
const cors = require('cors');
const app = express();

// socketHandler.init(server);

// require("./route/getPrices")(server);
require('dotenv').config();

mongoose.connect("mongodb+srv://new_db:newdb1902@cluster0.9ll3qel.mongodb.net/FX_Signal_Trading"
).then(() => console.log("Db Connected")).catch(()=> console.log("Database error"));
app.use(cors())
app.use(express.json());
app.use("/route",router);
app.use("/route",login);
app.use("/route",emailOTP);
app.use("/route",createSignal);
app.use("/route",getprices);
app.use("/route",addComment);
app.use("/route",copyTrade);
// app.use("/route",pairPrice);
app.route("/").get((req,res)=>{
res.json("hello world");
});



app.listen(port, "0.0.0.0",()=>{
    
    console.log("running in at "+port)
})

