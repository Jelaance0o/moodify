const express = require("express")
const cookieParser = require("cookie-parser")
const authRoutes = require("../src/routes/auth.routes")
const songRoute = require("./routes/song.routes")

const app = express()
app.use(express.json())
app.use(cookieParser())
const cors = require('cors')
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials:true
}))

app.use("/api/auth" ,authRoutes )   
app.use("/api/songs",songRoute)
module.exports = app


