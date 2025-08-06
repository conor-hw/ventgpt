<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
    <!-- Crisis Support Banner -->
    <CrisisBanner />
    
    <!-- Main Chat Interface -->
    <div class="container mx-auto px-4 py-6">
      <!-- Header -->
      <ChatHeader />
      
      <!-- Error Display -->
      <div v-if="error" class="max-w-4xl mx-auto mb-4">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <div class="flex items-center space-x-2">
            <ExclamationTriangleIcon class="h-5 w-5 text-red-600" />
            <span class="font-medium">Error:</span>
            <span>{{ error }}</span>
          </div>
          <button 
            @click="clearError" 
            class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Dismiss
          </button>
        </div>
      </div>
      
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
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

// Use the chat composable
const { sendMessage: sendChatMessage, isLoading, error, selectedPersonality, setPersonality, clearError } = useChat()

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

const selectPersonality = (personality) => {
  setPersonality(personality.id)
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
  const userMessage = {
    id: messages.value.length + 1,
    role: 'user',
    content: content.trim(),
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  
  // Prepare conversation history for API
  const conversationHistory = messages.value.map(msg => ({
    role: msg.role,
    content: msg.content
  }))
  
  // Call the API
  const response = await sendChatMessage(content.trim(), conversationHistory)
  
  if (response) {
    // Add AI response
    messages.value.push({
      id: messages.value.length + 1,
      role: 'assistant',
      content: response.response,
      timestamp: new Date(),
      isCrisis: response.isCrisis,
      safetyIssues: response.safetyIssues
    })
  }
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