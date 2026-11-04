const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', site: 'anascyber.site' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
