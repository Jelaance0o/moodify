const mongoose = require("mongoose");
const { type } = require("../config/cache");

const songSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    artist:{
        type:String,
    },
    year:{
        type:String
    },
    lyrics:{
        type:String
    },
    url:{
        type:String,
        required:true
    },
    posterURL:{
        type:String,
        required:true
    },
    mood:{
        type:String,
        enum:{
            values:["sad", "happy" , "anger"],
            message: "Enum this is"
        }
    }
})

const songModel = mongoose.model("song", songSchema);

module.exports = songModel