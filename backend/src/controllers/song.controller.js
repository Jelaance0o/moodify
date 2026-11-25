const songModel = require("../models/song.model")
const upload = require("../middleware/upload.middleware")
const id3 = require("node-id3")
const storageService = require("../services/storage.service")

async function uploadSong(req, res) {
    
    // console.log("Lyrics:", lyrics);
    // console.log("Title : ", tags.title)
    // console.log("Artist : ", tags.artist)
    // console.log("Year : ", tags.year)

    const songBuffer = req.file.buffer
    const { mood , lyrics } = req.body

    const tags = id3.read(songBuffer) 

    const [songFile , posterFile ] = await Promise.all([

        storageService.uploadFile({
            buffer:songBuffer,
            filename:tags.title + ".mp3",
            folder: "/cohort-2/moodify/songs"
        }),
        storageService.uploadFile({
            buffer:tags.image.imageBuffer,
            filename:tags.title + ".jpeg",
            folder: "/cohort-2/moodify/posters"
        })

    ])

    const song = await songModel.create({
      title: tags.title,
      artist: tags.artist,
      year: tags.year,
      url: songFile.url,
      posterURL: posterFile.url,
      lyrics,
      mood,
    });
    


    res.status(200).json({
        message: "Song Upload Successfully",
        song
    })

}

async function getSong(req,res){
    const {mood} = req.query

    const song = await songModel.find()

    res.status(200).json({
        message: "song fetch succesfully.",
        song
    })
}

module.exports = {uploadSong, getSong}
