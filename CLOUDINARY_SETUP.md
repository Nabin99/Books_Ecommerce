# Cloudinary Setup with Your Credentials

## ✅ **Your Cloudinary Credentials**

Based on your provided information:
- **Cloud Name**: `da7alaky0`
- **API Key**: `694384982711875`
- **API Secret**: `**********` (You'll need to provide the actual secret)

## 🔧 **Backend Environment Setup**

Create a `.env` file in your `backend` directory with the following content:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key_here

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
CLOUDINARY_API_SECRET=your_actual_api_secret_here
```

## ⚠️ **Important Notes**

1. **API Secret**: You need to replace `your_actual_api_secret_here` with your actual Cloudinary API secret
2. **Security**: Never commit your `.env` file to version control
3. **Backup**: Keep your API secret secure and don't share it publicly

## 🧪 **Testing Image Upload**

Once you've set up the environment variables:

1. **Start your backend server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Test the image upload**:
   - Go to your admin dashboard
   - Try adding a new product with an image
   - The image should upload to Cloudinary and display the Cloudinary URL

## 🔍 **Verifying Setup**

To verify your Cloudinary setup is working:

1. **Check Cloudinary Dashboard**: 
   - Go to https://cloudinary.com/console
   - Login with your account
   - Check the "Media Library" for uploaded images

2. **Test API Connection**:
   - Your images should appear in the `ecommerce-products` folder
   - URLs should start with: `https://res.cloudinary.com/da7alaky0/...`

## 🚀 **Next Steps**

1. **Complete Environment Setup**: Add your actual API secret
2. **Test Image Upload**: Try uploading a product image
3. **Verify Cloudinary Integration**: Check that images are stored in Cloudinary
4. **Set Up Stripe**: Add your Stripe credentials for payment processing

## 📞 **Need Help?**

If you need your API secret or have any issues:
1. Go to https://cloudinary.com/console
2. Navigate to Settings > Access Keys
3. Copy your API Secret
4. Add it to your `.env` file

Your Cloudinary setup is almost complete! Just add the API secret and you'll be ready to upload images. 🎉 