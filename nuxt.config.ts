// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  
  // Netlify deployment configuration
  nitro: {
    preset: 'netlify',
    experimental: {
      wasm: true
    }
  },
  
  // App configuration
  app: {
    head: {
      title: 'VentGPT - Your AI Mental Health Companion',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Safe, empathetic AI support for your mental wellbeing' }
      ]
    }
  },
  
  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (only available on server-side)
    geminiApiKey: process.env.GEMINI_API_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      appName: 'VentGPT'
    }
  }
})
