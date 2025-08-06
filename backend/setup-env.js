const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up your environment file...\n');

const envContent = `# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Email (for nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# CORS
ORIGIN=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Cloudinary (Your credentials)
CLOUDINARY_CLOUD_NAME=da7alaky0
CLOUDINARY_API_KEY=694384982711875
CLOUDINARY_API_SECRET=HN8tGzpIVd36I7YDgW5N2fdOSGQ
`;

const envPath = path.join(__dirname, '.env');

try {
	// Check if .env file already exists
	if (fs.existsSync(envPath)) {
		console.log('⚠️  .env file already exists!');
		console.log('Current content:');
		console.log(fs.readFileSync(envPath, 'utf8'));
		console.log('\nDo you want to overwrite it? (y/n)');
		// For now, let's just show the content
		return;
	}

	// Create .env file
	fs.writeFileSync(envPath, envContent);
	console.log('✅ .env file created successfully!');
	console.log('📁 Location:', envPath);
	console.log('\n📋 Content:');
	console.log(envContent);

	console.log('\n🎉 Your environment is now set up!');
	console.log('You can now run: node test-cloudinary.js');

} catch (error) {
	console.log('❌ Error creating .env file:', error.message);
	console.log('\n📝 Please manually create a .env file in the backend directory with this content:');
	console.log(envContent);
} 