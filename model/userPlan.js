const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userPlans = Schema({
    id:{
        type:String
    },
    planName:{
        type:String
    },
    user_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'registered'
    },
    planPrice:{
        type:Number
    },
    planPrivielege:{
        type:Array
    },
    date_bought:{
        type:Date
    },
    date_expired:{
        type:Date
    }
})

module.exports = mongoose.model('userPlans', userPlans);