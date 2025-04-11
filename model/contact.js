const mongoose = require("mongoose")

const Schema = mongoose.Schema

const contact = Schema({
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    email:{
        type:String
    },
    subject:{
        type:String
    },
    message:{
        type:String
    },
    date:{
        type:Date
    }
})

module.exports = mongoose.model('contact', contact);