# MongoDB Atlas Connection Guide

This guide shows you how to connect your Node.js/Express backend to MongoDB Atlas.

## 📋 Prerequisites

- Node.js installed
- MongoDB Atlas account and cluster created
- Connection string from MongoDB Atlas

## 🔧 Step-by-Step Setup

### 1. Install Required Packages

```bash
cd backend
npm install mongoose dotenv
```

### 2. Create `.env` File

Create a `.env` file in your `backend` directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://divyansh:divyanshlord@cluster0.uahidqc.mongodb.net/hospital_management?retryWrites=true&w=majority

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

**Important Notes:**
- Replace `hospital_management` with your desired database name
- The connection string format: `mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority`
- Never commit `.env` file to Git (it's already in `.gitignore`)

### 3. Mongoose Connection Code

Create `backend/config/database.js`:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 4. Update Your Server File

In your main server file (e.g., `server.js`), add:

```javascript
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables FIRST (before using process.env)
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

// Rest of your Express app setup
const app = express();

// ... your routes and middleware

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

**Key Points:**
- Call `dotenv.config()` **before** using any `process.env` variables
- Call `connectDB()` **before** starting your Express server
- The connection is asynchronous, but Mongoose handles connection pooling automatically

## 🔍 Troubleshooting

### Issue 1: Connection Timeout

**Symptoms:**
```
MongooseServerSelectionError: connect ETIMEDOUT
```

**Solutions:**
1. **Check IP Whitelist in MongoDB Atlas:**
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Add `0.0.0.0/0` for development (allows all IPs)
   - For production, add your server's specific IP

2. **Verify Connection String:**
   - Check username and password are correct
   - Ensure no special characters need URL encoding
   - Verify cluster name matches

### Issue 2: Authentication Failed

**Symptoms:**
```
MongoServerError: Authentication failed
```

**Solutions:**
1. **Reset Database User Password:**
   - MongoDB Atlas → Database Access
   - Edit user → Reset password
   - Update `.env` file with new password

2. **Check Username:**
   - Ensure username matches exactly (case-sensitive)

### Issue 3: Invalid Connection String

**Symptoms:**
```
MongooseError: Invalid connection string
```

**Solutions:**
1. **URL Encode Special Characters:**
   - If password contains special characters, URL encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`

2. **Verify Format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

### Issue 4: Module Not Found

**Symptoms:**
```
Error: Cannot find module 'mongoose'
```

**Solution:**
```bash
npm install mongoose dotenv
```

### Issue 5: Environment Variables Not Loading

**Symptoms:**
```
MongoServerError: connection string is missing
```

**Solutions:**
1. **Verify `.env` file location:**
   - Must be in the same directory as `server.js`
   - Check file name is exactly `.env` (not `.env.txt`)

2. **Check `dotenv.config()` is called:**
   - Must be called before using `process.env`
   - Add at the very top of your server file

3. **Debug environment variables:**
   ```javascript
   console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'Missing');
   ```

## ✅ Testing the Connection

Create a simple test file `test-connection.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  });
```

Run it:
```bash
node test-connection.js
```

## 🔒 Security Best Practices

1. **Never commit `.env` to Git:**
   - Already in `.gitignore`
   - Use `.env.example` for documentation

2. **Use Strong Passwords:**
   - MongoDB Atlas database users should have strong passwords

3. **Restrict IP Access:**
   - In production, whitelist only your server IPs
   - Don't use `0.0.0.0/0` in production

4. **Rotate Credentials:**
   - Regularly update database passwords
   - Use environment-specific credentials

## 📚 Additional Resources

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Format](https://docs.mongodb.com/manual/reference/connection-string/)

## 🎯 Quick Checklist

- [ ] Installed `mongoose` and `dotenv`
- [ ] Created `.env` file with `MONGODB_URI`
- [ ] Added IP address to MongoDB Atlas whitelist
- [ ] Called `dotenv.config()` before using `process.env`
- [ ] Called `connectDB()` in server file
- [ ] Tested connection with test script
- [ ] Verified `.env` is in `.gitignore`

---

**Your connection string is already configured in `.env` file!** Just make sure:
1. Your IP is whitelisted in MongoDB Atlas
2. The database user credentials are correct
3. Run `npm install` in the backend directory

