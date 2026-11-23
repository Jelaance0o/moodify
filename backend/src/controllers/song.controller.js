const songModel = require("../models/song.model")
const upload = require("../middleware/upload.middleware")
const id3 = require("node-id3")
// const storageService = require("../services/storage.service")

async function songUpload(req,res){

    console.log("Upload file : ", req.file)
    const tags = id3.read(req.file.buffer)
    console.log(tags.title,tags.artist, tags.image.imageBuffer)

    res.status(200).json({
        message: "Song received successfully",
        metadata: tags
    })
}

module.exports = {songUpload}