---
name: instagram-analyzer
description: "Analyze Instagram profiles and posts using RapidAPI + Gemini AI"
homepage: https://rapidapi.com
metadata: { "openclaw": { "emoji": "📸", "requires": { "bins": ["curl", "jq"], "env": ["RAPIDAPI_KEY", "GEMINI_API_KEY"] } } }
---
# Instagram Analyzer - Profile & Content Analysis

Analyze Instagram profiles, posts, and engagement using RapidAPI Instagram Data API and Gemini 2.5 Flash for AI-powered insights.

## Usage

When the user asks to analyze an Instagram profile, check engagement metrics, or get content strategy recommendations.

## Step 1: Fetch Profile Data

```bash
USERNAME="target_username"

# Get profile info
PROFILE=$(curl -s "https://instagram-data1.p.rapidapi.com/user/info" \
  -G -d "username=$USERNAME" \
  -H "x-rapidapi-key: $RAPIDAPI_KEY" \
  -H "x-rapidapi-host: instagram-data1.p.rapidapi.com")

echo "$PROFILE" | jq '{
  username: .username,
  full_name: .full_name,
  biography: .biography,
  followers: .follower_count,
  following: .following_count,
  posts: .media_count,
  is_verified: .is_verified,
  is_business: .is_business_account,
  category: .category_name
}'
```

## Step 2: Fetch Recent Posts

```bash
# Get recent posts/feed
POSTS=$(curl -s "https://instagram-data1.p.rapidapi.com/user/feed" \
  -G -d "username=$USERNAME" -d "limit=12" \
  -H "x-rapidapi-key: $RAPIDAPI_KEY" \
  -H "x-rapidapi-host: instagram-data1.p.rapidapi.com")

echo "$POSTS" | jq '.items[:12] | .[] | {
  type: .media_type,
  likes: .like_count,
  comments: .comment_count,
  caption: (.caption.text // "No caption")[:100],
  timestamp: .taken_at
}'
```

## Step 3: AI Analysis with Gemini

```bash
# Prepare data for Gemini analysis
ANALYSIS_DATA="Profile: $(echo $PROFILE | jq -c '{username, followers: .follower_count, following: .following_count, posts: .media_count, bio: .biography}')
Recent Posts: $(echo $POSTS | jq -c '[.items[:12][] | {likes: .like_count, comments: .comment_count, type: .media_type, caption: (.caption.text // "")[:80]}]')"

# Send to Gemini for analysis
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg data "$ANALYSIS_DATA" '{
    "contents": [{
      "parts": [{
        "text": ("Analyze this Instagram profile data and provide insights in Portuguese (Brazil). Include: 1) Engagement rate analysis, 2) Content performance patterns, 3) Top performing content types, 4) Recommendations for improvement. Data: " + $data)
      }]
    }]
  }')" | jq -r '.candidates[0].content.parts[0].text'
```

## Important Notes

- **RapidAPI rate limits:** Check your plan limits. Free tier is limited.
- **Gemini:** Using gemini-2.5-flash (free tier: 15 req/min).
- **Private profiles:** Cannot fetch data from private profiles.
- **Always respond in Portuguese** with the analysis.
- **Engagement rate formula:** (likes + comments) / followers * 100

## Workflow

1. Ask the user for the Instagram username to analyze.
2. Fetch profile data from RapidAPI.
3. Fetch recent posts data.
4. Calculate basic metrics (engagement rate, avg likes, etc.).
5. Send data to Gemini for AI-powered analysis.
6. Present a comprehensive report to the user.

## Error Handling

- If RapidAPI returns 429, rate limit reached — wait or inform user.
- If username not found, inform user the profile does not exist or is private.
- If Gemini fails, present raw metrics without AI analysis.
