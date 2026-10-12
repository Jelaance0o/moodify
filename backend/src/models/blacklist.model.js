const mongoose = require("mongoose")
const { applyTimestamps } = require("./user.model")

const blackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required:[true, "token is required for blacklisting"]
    }
},
    {timestamps: true})

const blacklistModel = mongoose.model('blacklist',blackListSchema)

module.exports = blacklistModel