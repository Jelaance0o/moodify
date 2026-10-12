const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const blacklistModel = require("../models/blacklist.model")
const redis = require("../config/cache")


async function authUser(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "token not provided"
        })
    }

    const isTokenBlacklisted = await redis.get(token)
    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (error) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }


}

module.exports = authUser

// redis - cli - u redis://default:b3GDxIMdl0320psLj5skM4HX9jFdZpj7@cattle-friends-receptive-27398.db.redis.io:14550

