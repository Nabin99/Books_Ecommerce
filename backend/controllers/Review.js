const Review = require("../models/Review")
const Product = require("../models/Product")

exports.create = async (req, res) => {
    try {
        const userId = req.user._id;
        const { product: productId, rating, title, comment, images } = req.body;

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ user: userId, product: productId });
        if (existingReview) {
            return res.status(400).json({
                message: 'You have already reviewed this product'
            });
        }

        // Check if user has purchased this product (for purchase verification)
        const hasPurchased = await checkUserPurchase(userId, productId);

        const reviewData = {
            user: userId,
            product: productId,
            rating,
            title,
            comment,
            images: images || [],
            purchaseVerified: hasPurchased,
            verified: true, // Auto-approve for now
            status: 'approved'
        };

        const created = await new Review(reviewData).populate({
            path: 'user',
            select: "name email"
        });
        await created.save();

        // Update product average rating
        await updateProductRating(productId);

        res.status(201).json(created);
    } catch (error) {
        console.error('Review creation error:', error);
        return res.status(500).json({
            message: 'Error posting review, please try again later'
        });
    }
}

exports.getByProductId = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 10, sort = 'newest', rating } = req.query;

        let skip = (page - 1) * limit;
        let query = { product: id, status: 'approved' };
        let sortOption = {};

        // Filter by rating if provided
        if (rating) {
            query.rating = parseInt(rating);
        }

        // Sort options
        switch (sort) {
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'highest':
                sortOption = { rating: -1 };
                break;
            case 'lowest':
                sortOption = { rating: 1 };
                break;
            case 'helpful':
                sortOption = { 'helpful.count': -1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        const totalDocs = await Review.countDocuments(query);
        const result = await Review.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('user', 'name email')
            .exec();

        // Get review statistics
        const stats = await getReviewStats(id);

        res.set("X-Total-Count", totalDocs);
        res.status(200).json({
            reviews: result,
            stats,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalDocs,
                pages: Math.ceil(totalDocs / limit)
            }
        });

    } catch (error) {
        console.error('Review fetch error:', error);
        res.status(500).json({
            message: 'Error getting reviews for this product, please try again later'
        });
    }
}

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Check if user owns this review
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You can only edit your own reviews' });
        }

        const updated = await Review.findByIdAndUpdate(
            id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        ).populate('user', 'name email');

        // Update product average rating
        await updateProductRating(review.product);

        res.status(200).json(updated);
    } catch (error) {
        console.error('Review update error:', error);
        res.status(500).json({
            message: 'Error updating review, please try again later'
        });
    }
}

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Check if user owns this review or is admin
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== userId.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'You can only delete your own reviews' });
        }

        const deleted = await Review.findByIdAndDelete(id);

        // Update product average rating
        await updateProductRating(review.product);

        res.status(200).json(deleted);
    } catch (error) {
        console.error('Review delete error:', error);
        res.status(500).json({
            message: 'Error deleting review, please try again later'
        });
    }
}

exports.markHelpful = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const helpfulIndex = review.helpful.users.indexOf(userId);

        if (helpfulIndex > -1) {
            // Remove helpful vote
            review.helpful.users.splice(helpfulIndex, 1);
            review.helpful.count = Math.max(0, review.helpful.count - 1);
        } else {
            // Add helpful vote
            review.helpful.users.push(userId);
            review.helpful.count += 1;
        }

        await review.save();
        res.status(200).json(review);
    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).json({
            message: 'Error marking review as helpful'
        });
    }
}

// Helper functions
async function checkUserPurchase(userId, productId) {
    // This would check if user has purchased the product
    // For now, return false - implement based on your order system
    return false;
}

async function updateProductRating(productId) {
    try {
        const reviews = await Review.find({
            product: productId,
            status: 'approved'
        });

        if (reviews.length === 0) return;

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        await Product.findByIdAndUpdate(productId, {
            averageRating: Math.round(averageRating * 10) / 10,
            reviewCount: reviews.length
        });
    } catch (error) {
        console.error('Error updating product rating:', error);
    }
}

async function getReviewStats(productId) {
    try {
        const reviews = await Review.find({
            product: productId,
            status: 'approved'
        });

        const stats = {
            total: reviews.length,
            average: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };

        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => {
                stats.distribution[review.rating]++;
                return sum + review.rating;
            }, 0);

            stats.average = Math.round((totalRating / reviews.length) * 10) / 10;
        }

        return stats;
    } catch (error) {
        console.error('Error getting review stats:', error);
        return { total: 0, average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    }
}