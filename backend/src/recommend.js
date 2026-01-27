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

// Fetch scripture verses from Bible API
async function fetchScriptureVerses(topic) {
  try {
    // Using bible-api.com (free, no auth required)
    // Map common topics to scripture references
    const scriptureMap = {
      'anxiety': ['Philippians 4:6-7', 'Matthew 6:25-34', '1 Peter 5:7'],
      'depression': ['Psalm 23', 'Romans 8:26-28', 'Philippians 4:4-7'],
      'forgiveness': ['Ephesians 4:31-32', 'Matthew 6:14-15', 'Colossians 3:13'],
      'fear': ['2 Timothy 1:7', 'Psalm 27:1', 'Isaiah 41:10'],
      'love': ['1 John 4:7-8', '1 Corinthians 13', 'John 13:34-35'],
      'faith': ['Hebrews 11:1', 'Romans 10:17', 'Proverbs 3:5-6'],
      'hope': ['Romans 15:13', 'Psalm 42:5', 'Jeremiah 29:11'],
      'peace': ['John 14:27', 'Philippians 4:6-7', 'Isaiah 26:3'],
      'strength': ['Psalm 28:7', '2 Corinthians 12:9', 'Philippians 4:13'],
      'guidance': ['Proverbs 3:5-6', 'Psalm 37:23-24', 'James 1:5'],
    };

    // Find relevant scriptures based on topic
    let references = [];
    for (const [key, refs] of Object.entries(scriptureMap)) {
      if (topic.toLowerCase().includes(key)) {
        references = refs;
        break;
      }
    }

    // Default scriptures if no match
    if (references.length === 0) {
      references = ['Psalm 23', 'John 3:16', 'Proverbs 3:5-6'];
    }

    // Fetch actual verses
    const verses = [];
    for (const ref of references.slice(0, 3)) {
      try {
        const response = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=kjv`);
        if (response.ok) {
          const data = await response.json();
          verses.push({
            reference: data.reference,
            text: data.text,
            translation: data.translation?.name || 'KJV',
          });
        }
      } catch (err) {
        console.warn(`Failed to fetch verse ${ref}:`, err.message);
      }
    }

    return verses;
  } catch (error) {
    console.error('Error fetching scripture verses:', error.message);
    return [];
  }
}

// Get recommendations from Claude
async function getRecommendations(userQuestion) {
  if (!client) {
    throw new Error('Anthropic client not initialized. Check your CLAUDE_API_KEY.');
  }

  const resourcesContext = formatResourcesForContext();

  const systemPrompt = `You are a helpful assistant that recommends spiritual and faith resources grounded in Scripture.

Based on the user's question, recommend the most relevant resources from our library.

Library of available resources:
${resourcesContext}

Return your response as JSON with this structure:
{
  "understanding": "Brief summary of what the user is looking for",
  "scriptureTopics": ["topic1", "topic2", "topic3"],
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

Pick 3-5 of the most relevant resources. Include 2-3 scripture topics that relate to their question (e.g., "faith", "hope", "forgiveness", etc.). Match based on relevance keywords and category fit.`;

  try {
    const modelName = 'claude-3-haiku-20240307';
    console.log('Calling Claude API with model:', modelName);

    const response = await client.messages.create({
      model: modelName,
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

    // Fetch scripture verses based on identified topics
    const scriptureVerses = [];
    if (recommendation.scriptureTopics && recommendation.scriptureTopics.length > 0) {
      for (const topic of recommendation.scriptureTopics) {
        const verses = await fetchScriptureVerses(topic);
        scriptureVerses.push(...verses);
      }
    }
    recommendation.scripture = scriptureVerses;

    // Enrich with full resource details and add book cover images
    recommendation.recommendations = recommendation.recommendations.map((rec) => {
      const fullResource = resourceLibrary.find((r) => r.id === rec.id);
      if (fullResource) {
        // Add book cover image URL using Open Library API
        const coverUrl = fullResource.author
          ? `https://covers.openlibrary.org/b/name/${encodeURIComponent(fullResource.author.replace(/ /g, '_'))}-M.jpg`
          : null;
        return { ...fullResource, reason: rec.reason, coverUrl };
      }
      return rec;
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
