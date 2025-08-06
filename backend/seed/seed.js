const { seedBrand } = require("./Brand")
const { seedCategory } = require("./Category")
const { seedProduct } = require("./Product")
const { seedUser } = require("./User")
const { seedAddress } = require("./Address")
const { seedWishlist } = require("./Wishlist")
const { seedCart } = require("./Cart")
const { seedReview } = require("./Review")
const { seedOrder } = require("./Order")
const { connectToDB } = require("../database/db")

const seedData = async () => {
    try {
        await connectToDB()
        console.log('Seed [started] please wait..');

        // Clear existing data first
        console.log('Clearing existing data...');
        const Brand = require("../models/Brand");
        const Category = require("../models/Category");
        const Product = require("../models/Product");
        const User = require("../models/User");
        const Address = require("../models/Address");
        const Wishlist = require("../models/Wishlist");
        const Cart = require("../models/Cart");
        const Review = require("../models/Review");
        const Order = require("../models/Order");

        await Brand.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});
        await Address.deleteMany({});
        await Wishlist.deleteMany({});
        await Cart.deleteMany({});
        await Review.deleteMany({});
        await Order.deleteMany({});

        console.log('Existing data cleared successfully');

        // Seed new data
        await seedBrand()
        await seedCategory()
        await seedProduct()
        await seedUser()
        await seedAddress()
        await seedWishlist()
        await seedCart()
        await seedReview()
        await seedOrder()

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seedData()