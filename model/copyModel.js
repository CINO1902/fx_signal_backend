const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const copySchema = new Schema({
    id: {
        type: String,
        required: true, // Consider making it required if it's always needed
    },
    user_id: {
        type: String,
        required: true, 
    },
    signal_id: {
        type: String,
        required: true,
    },
    date_created: {
        type: Date,
        default: Date.now, // Automatically set creation date
    }
});

module.exports = mongoose.model("CopyDocument", copySchema);
