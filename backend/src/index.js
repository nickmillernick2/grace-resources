require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Grace Resources API' });
});

// TODO: Add recommendation endpoint
// POST /api/recommend
// Input: { question: string }
// Output: { resources: [] }

// TODO: Add resource library endpoints
// GET /api/resources
// GET /api/resources/:category

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
