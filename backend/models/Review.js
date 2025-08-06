const mongoose = require('mongoose')
const { Schema } = mongoose

const reviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    comment: {
        type: String,
        required: true,
        maxlength: 1000
    },
    images: [{
        type: String, // URLs to uploaded images
        maxlength: 5 // Maximum 5 images per review
    }],
    helpful: {
        count: {
            type: Number,
            default: 0
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: "User"
        }]
    },
    verified: {
        type: Boolean,
        default: false
    },
    purchaseVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    timestamps: true
})

// Index for better query performance
reviewSchema.index({ product: 1, createdAt: -1 })
reviewSchema.index({ user: 1, product: 1 }, { unique: true })

// Pre-save middleware to update updatedAt
reviewSchema.pre('save', function (next) {
    this.updatedAt = new Date()
    next()
})

module.exports = mongoose.model("Review", reviewSchema)