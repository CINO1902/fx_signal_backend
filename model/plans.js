const mongoose = require("mongoose")

const Schema = mongoose.Schema

const plans = Schema({
    id:{
        type:String
    },
    planName:{
        type:String
    },
    planPrice:{
        type:Number
    },
    planPrivielege:{
        type:Array
    },
    date_created:{
        type:Date
    }
})

module.exports = mongoose.model('plans', plans);