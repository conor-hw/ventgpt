# Build Debugging Guide

## 🔍 Debugging Netlify Build Issues

### Current Issue
The build is failing because the deploy directory doesn't exist. This suggests the `npm run build` command is not completing successfully.

### Local Testing Steps

1. **Test the build locally:**
   ```bash
   # Clean any existing build
   rm -rf .output dist .nuxt

   # Run the build
   npm run build

   # Check what was created
   ls -la .output/
   ls -la .output/public/
   find .output -name "*.html" | head -5
   ```

2. **Check for errors:**
   ```bash
   # Run build with verbose output
   npm run build -- --verbose

   # Check if generate works instead
   npm run generate
   ls -la .output/
   ```

3. **Test preview locally:**
   ```bash
   npm run build
   npm run preview
   # Visit http://localhost:3000
   ```

### Possible Solutions

#### Option 1: Use Static Generation
Update `netlify.toml`:
```toml
[build]
  command = "npm run generate"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "20"
```

#### Option 2: Let Netlify Auto-Detect
Remove build configuration and let Netlify detect Nuxt automatically:
```toml
[build.environment]
  NODE_VERSION = "20"

# Remove [build] section entirely
```

#### Option 3: Use Different Output Directory
Some Nuxt configurations output to different directories:
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

### Troubleshooting Checklist

- [ ] Local build completes without errors
- [ ] `.output/public/index.html` exists after build
- [ ] Node.js version is 20+ locally
- [ ] All dependencies install without errors
- [ ] No TypeScript compilation errors
- [ ] API routes don't prevent static generation

### Common Issues

1. **Server-side functions prevent static generation**
   - Solution: Ensure API routes are properly configured for Netlify Functions

2. **Missing dependencies**
   - Solution: Check that all packages are in `dependencies`, not `devDependencies`

3. **TypeScript errors**
   - Solution: Fix any TypeScript compilation errors

4. **Environment variables missing during build**
   - Solution: Some builds need env vars at build time, not just runtime

### Next Steps

1. Test the build locally first
2. If local build works, check Netlify build logs for specific errors
3. Try different build configurations based on local results
4. Consider using Netlify Functions for API routes if SSR is needed 