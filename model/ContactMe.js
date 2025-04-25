const mongoose = require("mongoose")

const Schema = mongoose.Schema

const contactme = Schema({
    fullname:{
        type:String
    },
    email:{
        type:String
    },
    message:{
        type:String
    },
    date:{
        type:Date
    }
})

module.exports = mongoose.model('contactme', contactme);