const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware to parse JSON bodies (needed for Create/Update operations)
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB Database
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Health & Database Status Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Online', 
    site: 'anascyber.site',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
