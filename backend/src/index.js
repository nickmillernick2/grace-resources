require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { loadResourceLibrary, getRecommendations } = require('./recommend');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load resources on startup
loadResourceLibrary();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Grace Resources API' });
});

// Main recommendation endpoint
app.post('/api/recommend', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid "question" field',
      });
    }

    if (question.trim().length < 5) {
      return res.status(400).json({
        error: 'Question must be at least 5 characters',
      });
    }

    console.log('Processing recommendation request:', question.substring(0, 50));

    const recommendations = await getRecommendations(question);

    return res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Error in /api/recommend:', error);
    return res.status(500).json({
      error: 'Failed to generate recommendations',
      details: error.message,
    });
  }
});

// Get all resources (for browsing)
app.get('/api/resources', (req, res) => {
  try {
    const category = req.query.category;
    const path = require('path');
    const libraryPath = path.join(__dirname, '../../resources/library.json');
    let resources = JSON.parse(require('fs').readFileSync(libraryPath, 'utf8'));

    if (category) {
      resources = resources.filter((r) => r.category === category);
    }

    res.json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    console.error('Error in /api/resources:', error);
    res.status(500).json({
      error: 'Failed to fetch resources',
      details: error.message,
    });
  }
});

// Get resource categories
app.get('/api/categories', (req, res) => {
  try {
    const path = require('path');
    const fs = require('fs');
    const libraryPath = path.join(__dirname, '../../resources/library.json');
    const resources = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
    const categories = [...new Set(resources.map((r) => r.category))].sort();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error in /api/categories:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      details: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log(`Grace Resources API running on port ${PORT}`);
  console.log(`POST /api/recommend - Get resource recommendations`);
  console.log(`GET /api/resources - Browse all resources`);
  console.log(`GET /api/categories - List all categories`);
  console.log(`GET /health - Health check`);
});
