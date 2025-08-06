const mongoose = require("mongoose")
const { Schema } = mongoose

const variantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    options: [{
        value: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            default: 0 // Additional price for this variant
        },
        stockQuantity: {
            type: Number,
            default: 0
        },
        sku: {
            type: String,
            unique: true,
            sparse: true
        }
    }]
}, { _id: true })

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    stockQuantity: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    // Rating and review fields
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    // Product variants (size, color, etc.)
    variants: [variantSchema],
    // Product tags for better search
    tags: [{
        type: String,
        trim: true
    }],
    // SEO fields
    metaTitle: {
        type: String,
        maxlength: 60
    },
    metaDescription: {
        type: String,
        maxlength: 160
    },
    // Product status
    status: {
        type: String,
        enum: ['active', 'inactive', 'out_of_stock'],
        default: 'active'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true, 
    versionKey: false 
})

// Indexes for better search performance
productSchema.index({ title: 'text', description: 'text', tags: 'text' })
productSchema.index({ category: 1, brand: 1 })
productSchema.index({ averageRating: -1 })
productSchema.index({ price: 1 })
productSchema.index({ status: 1, isDeleted: 1 })

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
    if (this.discountPercentage > 0) {
        return this.price - (this.price * this.discountPercentage / 100);
    }
    return this.price;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema)