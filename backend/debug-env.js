const path = require('path');
const fs = require('fs');

console.log('🔍 Debugging environment variables...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
console.log('Looking for .env file at:', envPath);
console.log('File exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
	console.log('\n📄 .env file content:');
	console.log(fs.readFileSync(envPath, 'utf8'));
}

// Try loading with dotenv
console.log('\n📡 Loading with dotenv...');
require('dotenv').config();

console.log('\n🔍 Environment variables after dotenv:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');

// Try loading with explicit path
console.log('\n📡 Loading with explicit path...');
require('dotenv').config({ path: envPath });

console.log('\n🔍 Environment variables after explicit path:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'); 