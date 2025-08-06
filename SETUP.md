# VentGPT Setup Guide

## 1. Environment Configuration

### Step 1: Create Environment File
Copy the example environment file and add your Gemini API key:

```bash
cp .env.example .env
```

### Step 2: Add Your Gemini API Key
Edit the `.env` file and replace the placeholder with your actual API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=development
```

## 2. Getting Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key" in the top right
4. Create a new API key or use an existing one
5. Copy the API key and paste it in your `.env` file

## 3. Running the Application

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 4. Testing the Integration

1. **Select a Personality**: Choose one of the four AI personalities
2. **Start a Conversation**: Type a message and press Enter
3. **Test Safety Features**: Try messages that might trigger crisis detection
4. **Check Error Handling**: Verify error messages display properly

## 5. Safety Features

The application includes comprehensive safety features:

- **Crisis Detection**: Automatically detects concerning messages
- **Content Validation**: Filters prohibited content
- **Emergency Contacts**: Provides immediate access to crisis services
- **Safety Warnings**: Displays safety notices for flagged content

## 6. Troubleshooting

### Common Issues:

1. **API Key Error**: Ensure your `.env` file is in the root directory and contains the correct API key
2. **Network Errors**: Check your internet connection and API key validity
3. **Component Errors**: Restart the development server if components don't load

### Debug Mode:
Check the browser console and server logs for detailed error information.

## 7. Next Steps

- [ ] Test all personality types
- [ ] Verify crisis detection works
- [ ] Test error handling scenarios
- [ ] Review safety features
- [ ] Prepare for production deployment 