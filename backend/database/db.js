require('dotenv').config()
const mongoose = require("mongoose")

// Set JWT secret if not provided in environment
if (!process.env.SECRET_KEY) {
    process.env.SECRET_KEY = 'your_super_secret_jwt_key_for_development_12345'
}

// Set JWT expiration times if not provided
if (!process.env.LOGIN_TOKEN_EXPIRATION) {
    process.env.LOGIN_TOKEN_EXPIRATION = '7d'
}

if (!process.env.PASSWORD_RESET_TOKEN_EXPIRATION) {
    process.env.PASSWORD_RESET_TOKEN_EXPIRATION = '1h'
}

exports.connectToDB = async () => {
    try {
        // Use the MongoDB Atlas connection string with the provided credentials
        const MONGODB_URI = "mongodb+srv://groupproject:xBBd98HTU13aCOqV@cluster0.opnq8yy.mongodb.net/books_ecommerce?retryWrites=true&w=majority&appName=Cluster0"

        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connected to MongoDB Atlas Cloud Database');
    } catch (error) {
        console.error('❌ Database connection error:', error);
    }
}