const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;
const ADMIN_PASS = process.env.ADMIN_PASS; 

// Middleware (Increased limit to 10MB to allow file uploads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- 1. DATABASE SCHEMA ---
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  fileData: { type: String }, // Stores the file itself securely
  fileName: { type: String }, // Stores the name of the file
  createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', projectSchema);

// --- AUTH MIDDLEWARE ---
const verifyAdmin = (req, res, next) => {
  const clientPass = req.headers['x-admin-pass'];
  if (clientPass === ADMIN_PASS) next(); 
  else res.status(401).json({ error: 'Unauthorized: Incorrect Admin Password' });
};

// --- 2. API ROUTES (CRUD) ---
app.post('/api/projects', verifyAdmin, async (req, res) => {
  try {
    const savedProject = await new Project(req.body).save();
    res.status(201).json(savedProject);
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/projects/:id', verifyAdmin, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProject);
  } catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/projects/:id', verifyAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Log deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', site: 'anascyber.site', database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
