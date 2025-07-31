<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
    <!-- Crisis Support Banner -->
    <CrisisBanner />
    
    <!-- Main Chat Interface -->
    <div class="container mx-auto px-4 py-6">
      <!-- Header -->
      <ChatHeader />
      
      <!-- Personality Selection (shown only when no conversation) -->
      <PersonalitySelector v-if="!hasConversation" @select="selectPersonality" />
      
      <!-- Chat Messages -->
      <ChatMessages :messages="messages" :is-loading="isLoading" />
      
      <!-- Chat Input -->
      <ChatInput @send="sendMessage" :disabled="isLoading" />
    </div>
  </div>
</template>

<script setup>
// Explicit component imports (in case auto-import isn't working)
import CrisisBanner from '~/components/CrisisBanner.vue'
import ChatHeader from '~/components/ChatHeader.vue'
import PersonalitySelector from '~/components/PersonalitySelector.vue'
import ChatMessages from '~/components/ChatMessages.vue'
import ChatInput from '~/components/ChatInput.vue'

// Sample data - will be replaced with real API integration
const messages = ref([
  {
    id: 1,
    role: 'assistant',
    content: 'Hello! I\'m here to listen and support you. How are you feeling today?',
    timestamp: new Date()
  }
])

const hasConversation = computed(() => messages.value.length > 1)
const isLoading = ref(false)
const selectedPersonality = ref(null)

const selectPersonality = (personality) => {
  selectedPersonality.value = personality
  // Add personality introduction message
  messages.value.push({
    id: messages.value.length + 1,
    role: 'assistant',
    content: `Hi! I'm your ${personality.name}. ${personality.introduction}`,
    timestamp: new Date()
  })
}

const sendMessage = async (content) => {
  if (!content.trim()) return
  
  // Add user message
  messages.value.push({
    id: messages.value.length + 1,
    role: 'user',
    content: content.trim(),
    timestamp: new Date()
  })
  
  isLoading.value = true
  
  // Simulate AI response (replace with real Gemini API call)
  setTimeout(() => {
    messages.value.push({
      id: messages.value.length + 1,
      role: 'assistant',
      content: 'Thank you for sharing that with me. I hear you, and your feelings are valid. Would you like to talk more about what\'s on your mind?',
      timestamp: new Date()
    })
    isLoading.value = false
  }, 1500)
}
</script>

<style>
/* Custom component styles for VentGPT */
.chat-bubble {
  @apply max-w-3xl mx-auto p-4 rounded-2xl shadow-sm;
}

.chat-bubble.user {
  @apply bg-blue-600 text-white ml-auto mr-4;
}

.chat-bubble.assistant {
  @apply bg-white border border-gray-200 ml-4 mr-auto;
}

.chat-input {
  @apply w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none;
}

.crisis-banner {
  @apply bg-red-50 border border-red-200 rounded-lg p-3 text-red-800 text-sm;
}

.personality-card {
  @apply p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-blue-300 hover:shadow-md;
}

.personality-card.active {
  @apply border-blue-500 bg-blue-50;
}
</style> 