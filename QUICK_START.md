# 🚀 Quick Start Guide - Modern Hospital Management System

## Installation

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Configure Environment
Create `backend/.env`:
```env
MONGODB_URI=mongodb+srv://divyansh:divyanshlord@cluster0.uahidqc.mongodb.net/hospital_management?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Running the Application

### Start Backend
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

## Access Points

- **Landing Page**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard (after login)

## Default Login

- **Email**: divyanshdobhal64@gmail.com
- **Password**: admin123

## New Features Overview

✅ **Real-Time Notifications** - Socket.io powered
✅ **Dark/Light Mode** - Theme toggle in navbar
✅ **Interactive Dashboard** - Charts and statistics
✅ **File Upload** - Drag & drop file management
✅ **Advanced Search** - Debounced search with filters
✅ **Messaging System** - Internal messaging
✅ **Modern UI** - Animations and smooth transitions
✅ **Responsive Design** - Mobile-friendly

## Key Components

- `NotificationBell` - Real-time notifications
- `FileUpload` - Drag & drop file upload
- `SearchBar` - Advanced search with filters
- `Modal` - Reusable modal component
- `DashboardModern` - Interactive dashboard with charts

## Troubleshooting

**Socket.io not connecting?**
- Ensure backend is running on port 5000
- Check CORS settings in `server.js`
- Verify JWT token is valid

**File upload fails?**
- Check `backend/uploads/` directory exists
- Verify file size (max 10MB)
- Check file type is allowed

**Theme not working?**
- Clear browser localStorage
- Check browser console for errors
- Verify ThemeProvider wraps the app

---

For detailed documentation, see `UPGRADE_GUIDE.md`

