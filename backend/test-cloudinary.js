// Load environment variables first
require('dotenv').config();

console.log('🔍 Testing Cloudinary Configuration...\n');

// Check if environment variables are set
console.log('Environment Variables:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || '❌ NOT SET');
console.log('API Key:', process.env.CLOUDINARY_API_KEY || '❌ NOT SET');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ SET' : '❌ NOT SET');

// Only test if environment variables are loaded
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
	console.log('\n❌ Environment variables not loaded properly!');
	console.log('Please check your .env file in the backend directory.');
	process.exit(1);
}

console.log('\n📡 Testing Cloudinary Connection...');

// Import cloudinary after environment variables are loaded
const cloudinary = require('cloudinary').v2;

// Configure cloudinary with environment variables
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test basic connection
cloudinary.api.ping()
	.then(result => {
		console.log('✅ Cloudinary connection successful!');
		console.log('Response:', result);
		console.log('\n🎉 Your Cloudinary setup is working correctly!');
		console.log('You can now upload images to your e-commerce application!');
	})
	.catch(error => {
		console.log('❌ Cloudinary connection failed!');
		console.log('Error:', error.message);
		console.log('\n🔧 Please check your credentials:');
		console.log('1. Cloud Name: da7alaky0');
		console.log('2. API Key: 694384982711875');
		console.log('3. API Secret: HN8tGzpIVd36I7YDgW5N2fdOSGQ');
	}); 