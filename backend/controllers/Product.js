const Product = require("../models/Product");
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Upload image to Cloudinary
const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'ecommerce-products',
            use_filename: true
        });

        // Delete local file after upload
        fs.unlinkSync(filePath);

        return result.secure_url;
    } catch (error) {
        // Delete local file if upload fails
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw error;
    }
};

exports.create = async (req, res) => {
    try {
        let imageUrl = '';

        // If file is uploaded, upload to Cloudinary
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.path);
        }

        const productData = {
            ...req.body,
            image: imageUrl
        };

        const created = new Product(productData);
        await created.save();
        res.status(201).json(created);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error creating product, please try again later' });
    }
};

exports.getAll = async (req, res) => {
    try {
        let skip = 0;
        let limit = 0;
        let filter = { isDeleted: false };

        // Pagination
        if (req.query.page && req.query.limit) {
            const pageSize = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
            skip = pageSize * (page - 1);
            limit = pageSize;
        }

        // Advanced Search
        if (req.query.search) {
            const searchTerm = req.query.search;
            filter.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        // Category Filter
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Brand Filter
        if (req.query.brand) {
            filter.brand = req.query.brand;
        }

        // Price Range Filter
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
        }

        // Rating Filter
        if (req.query.minRating) {
            filter.averageRating = { $gte: parseFloat(req.query.minRating) };
        }

        // Stock Filter
        if (req.query.inStock === 'true') {
            filter.stockQuantity = { $gt: 0 };
        }

        // Discount Filter
        if (req.query.hasDiscount === 'true') {
            filter.discountPercentage = { $gt: 0 };
        }

        // Advanced Sorting
        let sort = {};
        if (req.query.sortBy) {
            const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

            switch (req.query.sortBy) {
                case 'price':
                    sort.price = sortOrder;
                    break;
                case 'rating':
                    sort.averageRating = sortOrder;
                    break;
                case 'reviews':
                    sort.reviewCount = sortOrder;
                    break;
                case 'newest':
                    sort.createdAt = -1;
                    break;
                case 'oldest':
                    sort.createdAt = 1;
                    break;
                case 'popular':
                    sort.reviewCount = -1;
                    break;
                case 'discount':
                    sort.discountPercentage = -1;
                    break;
                default:
                    sort[req.query.sortBy] = sortOrder;
            }
        } else {
            sort = { createdAt: -1 }; // Default sort by newest
        }

        const totalDocs = await Product.find(filter).countDocuments().exec();
        const results = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit || 10)
            .populate('category', 'name')
            .populate('brand', 'name')
            .exec();

        // Get search facets
        const facets = await getSearchFacets(filter);

        res.header("X-Total-Count", totalDocs);
        res.status(200).json({
            products: results,
            pagination: {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                total: totalDocs,
                pages: Math.ceil(totalDocs / (parseInt(req.query.limit) || 10))
            },
            facets
        });

    } catch (error) {
        console.error('Product search error:', error);
        return res.status(500).json({ message: 'Error searching products, please try again later' });
    }
};

// Get search facets for filtering
async function getSearchFacets(filter) {
    try {
        // Simplified facets for now
        const [categories, brands] = await Promise.all([
            Product.distinct('category', filter),
            Product.distinct('brand', filter)
        ]);

        return {
            categories: categories.map(cat => ({ _id: cat, count: 1 })),
            brands: brands.map(brand => ({ _id: brand, count: 1 })),
            priceRanges: [],
            ratings: []
        };
    } catch (error) {
        console.error('Error getting facets:', error);
        return { categories: [], brands: [], priceRanges: [], ratings: [] };
    }
}

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
            .populate('category', 'name')
            .populate('brand', 'name');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Product fetch error:', error);
        return res.status(500).json({ message: 'Error fetching product, please try again later' });
    }
};

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        console.error('Product update error:', error);
        return res.status(500).json({ message: 'Error updating product, please try again later' });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.findByIdAndDelete(id);
        res.status(200).json(deleted);
    } catch (error) {
        console.error('Product delete error:', error);
        return res.status(500).json({ message: 'Error deleting product, please try again later' });
    }
};

// Get product suggestions for search autocomplete
exports.getSuggestions = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.status(200).json({ suggestions: [] });
        }

        const suggestions = await Product.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ],
            isDeleted: false,
            status: 'active'
        })
            .select('title tags category brand')
            .populate('category', 'name')
            .populate('brand', 'name')
            .limit(10);

        res.status(200).json({ suggestions });
    } catch (error) {
        console.error('Search suggestions error:', error);
        res.status(500).json({ message: 'Error getting suggestions' });
    }
};

// Get related products
exports.getRelated = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const related = await Product.find({
            $or: [
                { category: product.category },
                { brand: product.brand },
                { tags: { $in: product.tags } }
            ],
            _id: { $ne: id },
            isDeleted: false,
            status: 'active'
        })
            .populate('category', 'name')
            .populate('brand', 'name')
            .limit(8);

        res.status(200).json(related);
    } catch (error) {
        console.error('Related products error:', error);
        res.status(500).json({ message: 'Error getting related products' });
    }
};


