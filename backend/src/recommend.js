const { Anthropic } = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Initialize client
let client;
try {
  client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });
  console.log('Anthropic client initialized successfully');
  console.log('Client keys:', Object.keys(client).slice(0, 10));
} catch (error) {
  console.error('Failed to initialize Anthropic client:', error.message);
  console.error('API Key present:', !!process.env.CLAUDE_API_KEY);
}

// Load resource library
let resourceLibrary = [];

function loadResourceLibrary() {
  try {
    // Path from backend/src/ to ../../resources/library.json
    const libraryPath = path.join(__dirname, '../../resources/library.json');
    const data = fs.readFileSync(libraryPath, 'utf8');
    resourceLibrary = JSON.parse(data);
    console.log(`Loaded ${resourceLibrary.length} resources from library`);
  } catch (error) {
    console.error('Failed to load resource library:', error.message);
    console.error('Looked for library at:', path.join(__dirname, '../../resources/library.json'));
    resourceLibrary = [];
  }
}

// Format resources for Claude context
function formatResourcesForContext() {
  return resourceLibrary
    .map(
      (r) => `
- **${r.title}** by ${r.author}
  Type: ${r.type} | Category: ${r.category}
  Description: ${r.description}
  Relevance: ${r.relevance?.join(', ') || 'general'}
  ${r.reference ? `Reference: ${r.reference}` : ''}
`
    )
    .join('\n');
}

// Get recommendations from Claude
async function getRecommendations(userQuestion) {
  if (!client) {
    throw new Error('Anthropic client not initialized. Check your CLAUDE_API_KEY.');
  }

  const resourcesContext = formatResourcesForContext();

  const systemPrompt = `You are a helpful assistant that recommends spiritual and faith resources.

Based on the user's question, recommend the most relevant resources from our library.

Library of available resources:
${resourcesContext}

Return your response as JSON with this structure:
{
  "understanding": "Brief summary of what the user is looking for",
  "recommendations": [
    {
      "id": "resource-id",
      "title": "Resource Title",
      "author": "Author Name",
      "reason": "Why this resource is helpful for their question"
    }
  ],
  "summary": "A brief encouraging note about their journey"
}

Pick 3-5 of the most relevant resources. Match based on relevance keywords and category fit.`;

  try {
    console.log('Calling Claude API with model: claude-3-5-sonnet-20241022');
    console.log('Client type:', typeof client);
    console.log('Client has messages:', !!client.messages);

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userQuestion,
        },
      ],
    });

    console.log('Received response from Claude');

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not find JSON in Claude response');
    }

    const recommendation = JSON.parse(jsonMatch[0]);

    // Enrich with full resource details
    recommendation.recommendations = recommendation.recommendations.map((rec) => {
      const fullResource = resourceLibrary.find((r) => r.id === rec.id);
      return fullResource ? { ...fullResource, reason: rec.reason } : rec;
    });

    return recommendation;
  } catch (error) {
    console.error('Error getting recommendations from Claude:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}

module.exports = {
  loadResourceLibrary,
  getRecommendations,
};
