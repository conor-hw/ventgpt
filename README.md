# VentGPT - AI Mental Health Companion

> **Safe, empathetic AI support for your mental wellbeing**

VentGPT is an AI-powered mental health support web application designed to provide users with a safe, empathetic, and accessible conversational companion. Built with Nuxt 3 and Google's Gemini API, VentGPT prioritizes user safety through strict AI safety rulesets and location-based crisis support integration.

![VentGPT Interface](https://img.shields.io/badge/Status-Beta-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Nuxt](https://img.shields.io/badge/Nuxt-3.0-black) ![Vue](https://img.shields.io/badge/Vue-3.0-4FC08D)

## 🌟 Features

### 🤖 AI Personalities
Choose from four distinct AI companions, each with their own approach and communication style:

- **🤗 Supportive Friend** - Warm, empathetic, and encouraging like a close friend
- **🎓 Professional Counselor** - Structured, therapeutic approach with evidence-based techniques
- **✨ Mindfulness Guide** - Calm, centered focus on present-moment awareness
- **💡 Problem Solver** - Practical, action-oriented support for challenges

### 🛡️ Safety & Crisis Support

**Comprehensive Safety Features:**
- **Real-time crisis detection** with immediate intervention
- **Content validation** against prohibited topics
- **Automatic emergency contact** recommendations
- **Safety warnings** for flagged responses
- **24/7 crisis support** integration with Irish mental health services

**Crisis Support Services:**
- **Samaritans**: 116 123 (24/7 confidential support)
- **Emergency Services**: 999 or 112
- **HSE Mental Health**: 1800 111 888
- **Pieta**: 1800 247 247 (suicide prevention)
- **Text Support**: HELLO to 50808, HELP to 51444

### 🎨 Modern Interface
- **Beautiful, responsive design** that works on all devices
- **Real-time chat interface** with typing indicators
- **Accessibility compliant** (WCAG 2.1 AA)
- **Mobile-first approach** for optimal user experience
- **Crisis support banner** with immediate access to help

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ LTS
- npm, yarn, pnpm, or bun
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ventGPT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key" in the top right
4. Create a new API key or use an existing one
5. Copy the API key and paste it in your `.env` file

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Styling**: Tailwind CSS, Heroicons
- **AI**: Google Gemini 1.5 Flash API
- **Safety**: Custom validation engine
- **Deployment**: Vercel/Netlify ready

### Project Structure
```
ventGPT/
├── components/          # Vue components
│   ├── CrisisBanner.vue
│   ├── ChatHeader.vue
│   ├── PersonalitySelector.vue
│   ├── ChatMessages.vue
│   └── ChatInput.vue
├── composables/         # Vue composables
│   └── useChat.ts
├── server/             # API routes
│   └── api/
│       └── chat.post.ts
├── assets/             # Static assets
│   └── css/
│       └── main.css
├── v-docs/             # Project documentation
└── app.vue             # Main application
```

## 🛡️ Safety & Ethics

### AI Safety Rulesets
VentGPT implements strict safety guidelines:

- **Prohibited Content**: No suggestions of illegal activities, violence, or self-harm
- **Crisis Detection**: Automatic identification of concerning messages
- **Professional Referral**: Redirects to appropriate mental health services
- **Content Validation**: Filters harmful or dangerous content
- **Boundary Awareness**: Clear acknowledgment of AI limitations

### Privacy & Data Protection
- **No conversation storage** - messages are not logged or stored
- **Optional location data** - used only for service recommendations
- **GDPR compliant** - user privacy maintained throughout
- **Secure API communication** - encrypted data transmission

### Legal Disclaimers
- VentGPT is **not a replacement** for professional mental health services
- AI responses are generated and may not always be appropriate
- Users should seek professional help for serious mental health concerns
- Emergency situations require immediate contact with emergency services

## 🧪 Testing

### Manual Testing
1. **Personality Selection**: Test all four AI personalities
2. **Conversation Flow**: Verify chat functionality works correctly
3. **Crisis Detection**: Test with concerning messages
4. **Error Handling**: Verify error messages display properly
5. **Mobile Responsiveness**: Test on various device sizes

### Safety Testing
- Test crisis detection with various trigger phrases
- Verify emergency contact information is displayed
- Check content validation for prohibited topics
- Ensure safety warnings appear appropriately

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables
Ensure these are set in production:
- `GEMINI_API_KEY` - Your Google Gemini API key
- `NODE_ENV` - Set to 'production'

### Recommended Platforms
- **Vercel**: Optimized for Nuxt applications
- **Netlify**: Easy deployment with Git integration
- **Railway**: Simple container deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety
- Maintain accessibility standards
- Test safety features thoroughly
- Document new features

## 📚 Documentation

- [Project Roadmap](./PROJECT_ROADMAP.md) - Development timeline and milestones
- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [Safety Requirements](./v-docs/05_safety_requirements.md) - Safety implementation details
- [Architecture Overview](./v-docs/02_architecture.md) - Technical architecture

## 🆘 Crisis Support

**If you're in crisis or need immediate help:**

- **Ireland**: Samaritans 116 123, Emergency 999/112
- **International**: Find local crisis services at [befrienders.org](https://www.befrienders.org/)
- **Text Support**: Text HELLO to 50808 (Ireland)

**Remember**: VentGPT is not a replacement for professional mental health services. In emergency situations, please contact emergency services immediately.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for AI capabilities
- **Nuxt Team** for the amazing framework
- **Mental health professionals** for guidance on safety features
- **Open source community** for inspiration and tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/ventGPT/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/ventGPT/discussions)
- **Email**: support@ventgpt.com (if applicable)

---

**Made with ❤️ for mental health support**
