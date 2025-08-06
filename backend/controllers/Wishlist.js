const Wishlist = require("../models/Wishlist")

exports.create = async (req, res) => {
    try {
        // Get user ID from authenticated request
        const userId = req.user._id;

        // Check if item already exists in wishlist
        const existingItem = await Wishlist.findOne({
            user: userId,
            product: req.body.product
        });

        if (existingItem) {
            return res.status(400).json({
                message: "Product already exists in wishlist"
            });
        }

        // Create new wishlist item
        const wishlistItem = new Wishlist({
            user: userId,
            product: req.body.product,
            note: req.body.note || ""
        });

        await wishlistItem.save();

        const created = await Wishlist.findById(wishlistItem._id)
            .populate({ path: "product", populate: ["brand"] });

        res.status(201).json(created);
    } catch (error) {
        console.error('Wishlist creation error:', error);
        res.status(500).json({
            message: "Error adding product to wishlist, please try again later"
        });
    }
}

exports.getByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        let skip = 0;
        let limit = 0;

        if (req.query.page && req.query.limit) {
            const pageSize = req.query.limit;
            const page = req.query.page;
            skip = pageSize * (page - 1);
            limit = pageSize;
        }

        const result = await Wishlist.find({ user: id })
            .skip(skip)
            .limit(limit)
            .populate({ path: "product", populate: ['brand'] });

        const totalResults = await Wishlist.find({ user: id }).countDocuments().exec();

        res.set("X-Total-Count", totalResults);
        res.status(200).json(result);
    } catch (error) {
        console.error('Wishlist fetch error:', error);
        res.status(500).json({
            message: "Error fetching your wishlist, please try again later"
        });
    }
}

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Wishlist.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        ).populate("product");

        if (!updated) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        res.status(200).json(updated);
    } catch (error) {
        console.error('Wishlist update error:', error);
        res.status(500).json({
            message: "Error updating your wishlist, please try again later"
        });
    }
}

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Wishlist.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        return res.status(200).json(deleted);
    } catch (error) {
        console.error('Wishlist delete error:', error);
        res.status(500).json({
            message: "Error deleting that product from wishlist, please try again later"
        });
    }
}