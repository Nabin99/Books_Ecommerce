const express = require('express')
const reviewController = require("../controllers/Review")
const { verifyToken } = require('../middleware/VerifyToken')
const router = express.Router()

router
    .post("/", verifyToken, reviewController.create)
    .get('/product/:id', reviewController.getByProductId)
    .patch('/:id', verifyToken, reviewController.updateById)
    .delete("/:id", verifyToken, reviewController.deleteById)
    .post("/:id/helpful", verifyToken, reviewController.markHelpful)

module.exports = router