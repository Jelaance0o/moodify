const mongoose = require("mongoose")

const songSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    url:{
        type:String,
        require:true
    },
    posterURL:{
        type:String,
        require:true
    },
    mood:{
        type:String,
        enum:["sad","happiness", "surprice"]
    }
})

const songModel = mongoose.model("song", songSchema);

module.exports = songModel