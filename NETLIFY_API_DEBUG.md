# Netlify API Routes Debugging

## 🔍 Current Issue
The API routes are returning 404 errors in production because they're not being properly deployed as Netlify Functions.

## 🧪 Local Testing

### Test 1: Check Build Output
```bash
# Run build locally
npm run build

# Check what gets generated
ls -la .output/
ls -la .output/public/
ls -la .output/server/

# Look for Netlify functions
find .output -name "*chat*" -type f
find .output -name "*.mjs" -type f
```

### Test 2: Test API Route Locally
```bash
# Start dev server
npm run dev

# Test API in another terminal
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","personality":"supportive-friend"}'
```

## 🔧 Possible Solutions

### Solution 1: Ensure Correct Netlify Preset
Update `nuxt.config.ts`:
```typescript
export default defineNuxtConfig({
  nitro: {
    preset: 'netlify'
  }
})
```

### Solution 2: Check API Route Format
Ensure `server/api/chat.post.ts` exports the handler correctly:
```typescript
export default defineEventHandler(async (event) => {
  // Your API logic here
})
```

### Solution 3: Manual Function Deployment
If auto-deployment doesn't work, create manual Netlify function:

Create `netlify/functions/chat.js`:
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, personality } = JSON.parse(event.body);
    
    // Your chat logic here
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ response: 'Your response here' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
```

### Solution 4: Update Frontend API Call
Update `composables/useChat.ts` to handle production URL:
```typescript
const sendMessage = async (message: string, conversationHistory: any[] = []) => {
  const response = await $fetch('/api/chat', {
    method: 'POST',
    baseURL: process.env.NODE_ENV === 'production' 
      ? 'https://your-site.netlify.app' 
      : '',
    body: {
      message,
      personality: selectedPersonality.value,
      conversationHistory
    }
  })
  return response
}
```

## 🚀 Recommended Steps

1. **Test locally first** with the commands above
2. **Check build output** to see if functions are generated
3. **Try the build command** with debugging
4. **Check Netlify Functions tab** in dashboard after deployment
5. **Test API endpoint directly** in browser/Postman

## 📋 Checklist

- [ ] Local `npm run build` completes successfully
- [ ] API route works locally (`npm run dev`)
- [ ] `.output/server/` contains function files
- [ ] Netlify Functions appear in dashboard
- [ ] Environment variables set in Netlify
- [ ] CORS headers properly configured

## 🆘 Quick Fix

If nothing else works, try this in `netlify.toml`:
```toml
[build]
  command = "npm run build"
  functions = ".output/server"
  publish = ".output/public"
``` 