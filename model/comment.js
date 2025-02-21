const mongoose = require("mongoose")

const Schema = mongoose.Schema

const comment = Schema({
    id:{
        type:String
    },
    firstname:{
        type:String
    },
    signal_id:{
        type:String
    },
    lastname:{
        type:String
    },
    comment:{
        type:String
    },
    image_url:{
        type:String
    },
    date_created:{
        type:Date
    }
})

module.exports = mongoose.model('comment', comment);