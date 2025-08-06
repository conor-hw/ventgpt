# Netlify Deployment Guide for VentGPT

## 🚀 Quick Deployment

### Step 1: Connect to Netlify

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add Netlify deployment configuration"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose your GitHub repository
   - Select the main branch

### Step 2: Configure Build Settings

**Build settings in Netlify dashboard:**
- **Build command**: `npm run build`
- **Publish directory**: `.output/public`
- **Node version**: `18` (or higher)

### Step 3: Environment Variables

Add these environment variables in Netlify dashboard:

1. Go to **Site settings** > **Environment variables**
2. Add the following:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   NODE_ENV=production
   ```

## 🔧 Troubleshooting 404 Errors

### Common Issues and Solutions

#### 1. **Page Not Found Error**

**Problem**: Getting 404 errors on all routes except the homepage.

**Solution**: This is likely a routing issue. The `netlify.toml` and `public/_redirects` files should handle this.

**Check these files exist:**
- ✅ `netlify.toml` in root directory
- ✅ `public/_redirects` file
- ✅ Proper Nuxt configuration

#### 2. **Build Failures**

**Problem**: Build fails during deployment.

**Solutions**:
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

#### 3. **API Routes Not Working**

**Problem**: Chat API returns errors in production.

**Solutions**:
- Verify `GEMINI_API_KEY` is set in Netlify environment variables
- Check that the API route is properly configured
- Review server logs in Netlify dashboard

## 📁 Required Files

### 1. `netlify.toml` (Root Directory)
```toml
[build]
  command = "npm run build"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. `public/_redirects` (Public Directory)
```
/*    /index.html   200
```

### 3. `nuxt.config.ts` (Updated)
```typescript
export default defineNuxtConfig({
  // ... other config
  ssr: true,
  nitro: {
    preset: 'netlify'
  },
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    public: {
      appName: 'VentGPT'
    }
  }
})
```

## 🧪 Testing Deployment

### 1. **Local Testing**
```bash
# Test build locally
npm run build
npm run preview
```

### 2. **Production Testing**
- Visit your Netlify URL
- Test all routes (homepage, chat functionality)
- Verify API calls work
- Check mobile responsiveness

### 3. **Common Test Cases**
- ✅ Homepage loads correctly
- ✅ Personality selection works
- ✅ Chat functionality responds
- ✅ Crisis banner displays
- ✅ Mobile layout works
- ✅ API calls succeed

## 🔍 Debugging Steps

### 1. **Check Netlify Logs**
1. Go to Netlify dashboard
2. Click on your site
3. Go to **Deploys** tab
4. Click on the latest deploy
5. Check build logs for errors

### 2. **Verify Environment Variables**
1. Go to **Site settings** > **Environment variables**
2. Ensure `GEMINI_API_KEY` is set
3. Check that `NODE_ENV=production`

### 3. **Test API Endpoint**
```bash
# Test the API endpoint directly
curl -X POST https://your-site.netlify.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","personality":"supportive-friend"}'
```

## 🚨 Emergency Fixes

### If Still Getting 404 Errors:

1. **Clear Netlify Cache**
   - Go to **Site settings** > **Build & deploy**
   - Click "Clear cache and deploy site"

2. **Force Rebuild**
   - Go to **Deploys** tab
   - Click "Trigger deploy" > "Deploy site"

3. **Check File Structure**
   ```bash
   # Ensure these files exist
   ls -la netlify.toml
   ls -la public/_redirects
   ls -la nuxt.config.ts
   ```

4. **Verify Build Output**
   - Check that `.output/public` directory is created after build
   - Ensure `index.html` exists in the output

## 📞 Support

If you're still experiencing issues:

1. **Check Netlify Status**: [status.netlify.com](https://status.netlify.com)
2. **Review Build Logs**: Look for specific error messages
3. **Test Locally**: Ensure the app works locally first
4. **Contact Support**: Use Netlify's support channels

## 🎯 Success Checklist

- [ ] Site deploys without errors
- [ ] Homepage loads correctly
- [ ] All routes work (no 404 errors)
- [ ] Chat functionality responds
- [ ] API calls succeed
- [ ] Environment variables are set
- [ ] Mobile layout works
- [ ] Crisis support features work
- [ ] Performance is acceptable

---

**Remember**: The key to fixing 404 errors is ensuring proper routing configuration with the `netlify.toml` and `public/_redirects` files! 