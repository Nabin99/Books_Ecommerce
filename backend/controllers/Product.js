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
        let filter = {};

        // Pagination
        if (req.query.page && req.query.limit) {
            const pageSize = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
            skip = pageSize * (page - 1);
            limit = pageSize;
        }

        // Filtering
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.brand) {
            filter.brand = req.query.brand;
        }
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
        }
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Sorting
        let sort = {};
        if (req.query.sortBy) {
            const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
            sort[req.query.sortBy] = sortOrder;
        } else {
            sort = { createdAt: -1 }; // Default sort by newest
        }

        const totalDocs = await Product.find(filter).countDocuments().exec();
        const results = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('category', 'name')
            .populate('brand', 'name')
            .exec();

        res.header("X-Total-Count", totalDocs);
        res.status(200).json({
            products: results,
            pagination: {
                total: totalDocs,
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : totalDocs,
                pages: req.query.limit ? Math.ceil(totalDocs / parseInt(req.query.limit)) : 1
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching products, please try again later' });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Product.findById(id)
            .populate('category', 'name')
            .populate('brand', 'name');

        if (!result) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error fetching product, please try again later' });
    }
};

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        // If new image is uploaded, upload to Cloudinary
        if (req.file) {
            const imageUrl = await uploadToCloudinary(req.file.path);
            updateData.image = imageUrl;
        }

        const updated = await Product.findByIdAndUpdate(id, updateData, { new: true })
            .populate('category', 'name')
            .populate('brand', 'name');

        if (!updated) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating product, please try again later' });
    }
};

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting product, please try again later' });
    }
};

// Get products by category
exports.getByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.find({ category: categoryId })
            .populate('category', 'name')
            .populate('brand', 'name');

        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching products by category' });
    }
};

// Get products by brand
exports.getByBrand = async (req, res) => {
    try {
        const { brandId } = req.params;
        const products = await Product.find({ brand: brandId })
            .populate('category', 'name')
            .populate('brand', 'name');

        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching products by brand' });
    }
};


