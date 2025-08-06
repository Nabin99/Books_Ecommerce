const express = require('express')
const orderController = require("../controllers/Order")
const { verifyToken } = require('../middleware/VerifyToken')
const router = express.Router()

router
    .post("/", verifyToken, orderController.create)
    .get("/", verifyToken, orderController.getAll)
    .get("/user/:id", verifyToken, orderController.getByUserId)
    .patch("/:id", verifyToken, orderController.updateById)

module.exports = router