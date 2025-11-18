// Test MongoDB Atlas Connection
// Run: node test-connection.js

require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔌 Attempting to connect to MongoDB Atlas...');
console.log('Connection String:', process.env.MONGODB_URI ? '✅ Found' : '❌ Missing');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('\n✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔗 Ready State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your .env file has MONGODB_URI');
    console.log('2. Verify IP is whitelisted in MongoDB Atlas');
    console.log('3. Check username and password are correct');
    console.log('4. Ensure network connectivity');
    process.exit(1);
  });

