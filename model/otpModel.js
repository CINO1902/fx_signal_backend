const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const otp = Schema({
    otp:{
        type:String
    },
    email:{
        type:String
    },
    date_created:{
        type:Date
    },
    date_expired:{
        type: Date
    },
})

module.exports = mongoose.model('otp', otp);