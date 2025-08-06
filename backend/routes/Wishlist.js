const express = require("express")
const wishlistController = require("../controllers/Wishlist")
const { verifyToken } = require('../middleware/VerifyToken')
const router = express.Router()

router
    .post("/", verifyToken, wishlistController.create)
    .get("/user/:id", verifyToken, wishlistController.getByUserId)
    .patch("/:id", verifyToken, wishlistController.updateById)
    .delete("/:id", verifyToken, wishlistController.deleteById)

module.exports = router