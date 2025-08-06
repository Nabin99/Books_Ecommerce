# Authentication API Documentation

## Base URL
```
http://localhost:5000/api/auth
```

## Endpoints

### 1. User Registration
**POST** `/signup`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation Rules:**
- `name`: 2-50 characters, required
- `email`: Valid email format, unique, required
- `password`: Minimum 8 characters, must contain uppercase, lowercase, and number

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": false,
    "isAdmin": false
  }
}
```

**Error Responses:**
- `400`: Validation errors
- `409`: Email already exists
- `429`: Rate limit exceeded
- `500`: Server error

---

### 2. User Login
**POST** `/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true,
    "isAdmin": false
  }
}
```

**Error Responses:**
- `400`: Validation errors
- `401`: Invalid credentials
- `429`: Rate limit exceeded
- `500`: Server error

---

### 3. OTP Verification
**POST** `/verify-otp`

Verify user email with OTP.

**Request Body:**
```json
{
  "userId": "user_id",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true,
    "isAdmin": false
  }
}
```

**Error Responses:**
- `400`: Invalid OTP or validation errors
- `404`: User or OTP not found
- `500`: Server error

---

### 4. Resend OTP
**POST** `/resend-otp`

Request a new OTP for email verification.

**Request Body:**
```json
{
  "user": "user_id"
}
```

**Response (200):**
```json
{
  "message": "OTP sent successfully"
}
```

**Error Responses:**
- `400`: Validation errors
- `404`: User not found
- `429`: Rate limit exceeded
- `500`: Server error

---

### 5. Forgot Password
**POST** `/forgot-password`

Request password reset link.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "If the email exists, a password reset link has been sent."
}
```

**Error Responses:**
- `400`: Validation errors
- `429`: Rate limit exceeded
- `500`: Server error

---

### 6. Reset Password
**POST** `/reset-password`

Reset password using token.

**Request Body:**
```json
{
  "userId": "user_id",
  "token": "reset_token",
  "password": "NewSecurePass123"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

**Error Responses:**
- `400`: Invalid token or validation errors
- `404`: User not found or invalid reset link
- `500`: Server error

---

### 7. Logout
**POST** `/logout`

Logout user and clear JWT token.

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### 8. Check Authentication
**GET** `/check-auth`

Verify if user is authenticated.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Authentication successful",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true,
    "isAdmin": false
  }
}
```

**Error Responses:**
- `401`: Not authenticated
- `500`: Server error

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Signup**: 3 attempts per hour
- **Login**: 5 attempts per 15 minutes
- **OTP Resend**: 3 attempts per 15 minutes
- **Password Reset**: 3 attempts per hour
- **General**: 100 requests per 15 minutes

## Security Features

1. **Password Requirements**: Minimum 8 characters with uppercase, lowercase, and number
2. **JWT Tokens**: Secure token-based authentication
3. **Rate Limiting**: Protection against brute force attacks
4. **Input Validation**: Comprehensive validation for all inputs
5. **CORS Protection**: Configured for specific origins
6. **Security Headers**: Helmet.js for security headers
7. **XSS Protection**: Input sanitization
8. **Account Lockout**: Temporary lockout after failed login attempts

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description",
  "field": "field_name" // Optional, for validation errors
}
```

For validation errors with multiple fields:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
``` 