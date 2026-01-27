# Resource Schema

## Resource Object

Each resource in the library should have:

```json
{
  "id": "unique-id",
  "title": "Book/Scripture/Prayer Title",
  "author": "Author Name",
  "type": "book|scripture|prayer|article",
  "category": "doubt|loneliness|leadership|etc",
  "description": "Short description of the resource",
  "reference": "Book chapter:verse or URL or prayer text",
  "difficulty": "beginner|intermediate|advanced",
  "duration": "5 min read|30 min read|book",
  "relevance": ["keyword1", "keyword2"]
}
```

## Categories (TBD)

Placeholder categories to refine:
- Doubt & Faith Struggles
- Loneliness & Community
- Marriage & Relationships
- Starting/Leading a Group
- Prayer & Spiritual Growth
- Biblical Foundations
- Serving Others
- Personal Growth

**Action: Nick to finalize categories**

## Example Resource

```json
{
  "id": "bevere-good-fight",
  "title": "The Good Fight",
  "author": "John Bevere",
  "type": "book",
  "category": "faith-struggles",
  "description": "Understanding spiritual warfare and God's purpose for your life",
  "reference": "https://www.amazon.com/Good-Fight-Overflow-Confidence-Purpose/dp/B00FQNC0J0",
  "difficulty": "intermediate",
  "duration": "book",
  "relevance": ["faith", "purpose", "spiritual growth"]
}
```
