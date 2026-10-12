const {Router} = require("express")
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")

const router = Router()

router.post('/register',authController.registerUser)
router.post("/login", authController.loginUser);
router.get("/get-me", authMiddleware , authController.getMe)
router.get("/logout", authController.logoutUser)

module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYzUyOTY4ODJhZDRkN2VlMjJmYjYyNiIsInVzZXJuYW1lIjoidGVzdDIiLCJpYXQiOjE3OTE0NTcyMTksImV4cCI6MTc5MTcxNjQxOX0.B2CDmba1d37tTTgEMaWnbcNggkN5R5jDMfGO - 5BcQys