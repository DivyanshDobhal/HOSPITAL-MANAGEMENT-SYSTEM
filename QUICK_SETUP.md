# 🚀 Quick MongoDB Atlas Connection Setup

## ✅ What's Already Done

1. ✅ `.env` file created with your connection string
2. ✅ Database connection code in `backend/config/database.js`
3. ✅ Server file configured to load environment variables
4. ✅ Connection test script created

## 📝 Your Connection String

```
mongodb+srv://divyansh:divyanshlord@cluster0.uahidqc.mongodb.net/hospital_management?retryWrites=true&w=majority
```

**Stored in:** `backend/.env` as `MONGODB_URI`

## 🔧 Files Overview

### 1. `.env` File (backend/.env)
```env
MONGODB_URI=mongodb+srv://divyansh:divyanshlord@cluster0.uahidqc.mongodb.net/hospital_management?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

### 2. Database Connection (backend/config/database.js)
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

### 3. Server File (backend/server.js)
```javascript
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables FIRST
dotenv.config();

// Connect to database
connectDB();

// ... rest of your Express app
```

## 🧪 Test Your Connection

```bash
cd backend
node test-connection.js
```

Expected output:
```
✅ Successfully connected to MongoDB Atlas!
📊 Database: hospital_management
🌐 Host: cluster0-shard-00-00.xxxxx.mongodb.net
```

## ⚠️ Common Issues & Fixes

### Issue: Connection Timeout
**Fix:** Add your IP to MongoDB Atlas Network Access
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Add `0.0.0.0/0` (for development) or your specific IP

### Issue: Authentication Failed
**Fix:** Verify username/password in MongoDB Atlas
1. Go to Database Access
2. Check username matches exactly
3. Reset password if needed and update `.env`

### Issue: Environment Variable Not Found
**Fix:** Ensure `.env` file exists in `backend/` directory
```bash
ls -la backend/.env  # Should show the file
```

## 📦 Install Dependencies

```bash
cd backend
npm install mongoose dotenv
```

## 🎯 Next Steps

1. **Install dependencies:** `npm install` in backend directory
2. **Test connection:** `node test-connection.js`
3. **Start server:** `npm start` or `npm run dev`
4. **Verify:** Check console for "✅ MongoDB Atlas Connected"

---

**Everything is set up!** Just install dependencies and test the connection.

