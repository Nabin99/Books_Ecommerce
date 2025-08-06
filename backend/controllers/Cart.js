const Cart = require('../models/Cart')

exports.create = async (req, res) => {
    try {
        // Get user ID from authenticated request
        const userId = req.user._id;

        // Check if item already exists in cart
        const existingItem = await Cart.findOne({
            user: userId,
            product: req.body.product
        });

        if (existingItem) {
            // Update quantity if item exists
            existingItem.quantity += req.body.quantity || 1;
            await existingItem.save();

            const updatedItem = await Cart.findById(existingItem._id)
                .populate({ path: "product", populate: { path: "brand" } });

            return res.status(200).json(updatedItem);
        }

        // Create new cart item
        const cartItem = new Cart({
            user: userId,
            product: req.body.product,
            quantity: req.body.quantity || 1
        });

        await cartItem.save();

        const created = await Cart.findById(cartItem._id)
            .populate({ path: "product", populate: { path: "brand" } });

        res.status(201).json(created);
    } catch (error) {
        console.error('Cart creation error:', error);
        return res.status(500).json({
            message: 'Error adding product to cart, please try again later'
        });
    }
}

exports.getByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Cart.find({ user: id })
            .populate({ path: "product", populate: { path: "brand" } });

        res.status(200).json(result);
    } catch (error) {
        console.error('Cart fetch error:', error);
        return res.status(500).json({
            message: 'Error fetching cart items, please try again later'
        });
    }
}

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Cart.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        ).populate({ path: "product", populate: { path: "brand" } });

        if (!updated) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.status(200).json(updated);
    } catch (error) {
        console.error('Cart update error:', error);
        return res.status(500).json({
            message: 'Error updating cart items, please try again later'
        });
    }
}

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Cart.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.status(200).json(deleted);
    } catch (error) {
        console.error('Cart delete error:', error);
        return res.status(500).json({
            message: 'Error deleting cart item, please try again later'
        });
    }
}

exports.deleteByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Cart.deleteMany({ user: id });

        res.sendStatus(204);
    } catch (error) {
        console.error('Cart reset error:', error);
        res.status(500).json({
            message: "Some error occurred while resetting your cart"
        });
    }
}