<template>
  <div class="max-w-4xl mx-auto mb-6">
    <div class="space-y-6" ref="messagesContainer">
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex"
        :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="chat-bubble"
          :class="message.role"
        >
          <!-- Assistant Avatar and Name -->
          <div v-if="message.role === 'assistant'" class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <HeartIcon class="h-5 w-5 text-white" />
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <span class="text-sm font-medium text-gray-700">VentGPT</span>
                <span class="text-xs text-gray-500">{{ formatTime(message.timestamp) }}</span>
                <!-- Crisis indicator -->
                <span v-if="message.isCrisis" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <ExclamationTriangleIcon class="h-3 w-3 mr-1" />
                  Crisis Response
                </span>
              </div>
              <div class="text-gray-800 leading-relaxed">
                {{ message.content }}
                <!-- Safety issues warning -->
                <div v-if="message.safetyIssues && message.safetyIssues.length > 0" class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div class="flex items-start space-x-2">
                    <ExclamationTriangleIcon class="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div class="text-sm text-yellow-800">
                      <p class="font-medium mb-1">Safety Notice:</p>
                      <ul class="text-xs space-y-1">
                        <li v-for="issue in message.safetyIssues" :key="issue" class="flex items-center space-x-1">
                          <span class="w-1 h-1 bg-yellow-600 rounded-full"></span>
                          <span>{{ issue }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- User Message -->
          <div v-else class="text-right">
            <div class="flex items-center justify-end space-x-2 mb-1">
              <span class="text-xs text-blue-200">{{ formatTime(message.timestamp) }}</span>
              <span class="text-sm font-medium text-blue-100">You</span>
            </div>
            <div class="leading-relaxed">{{ message.content }}</div>
          </div>
        </div>
      </div>
      
      <!-- Loading indicator -->
      <div v-if="isLoading" class="flex justify-start">
        <div class="chat-bubble assistant">
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <HeartIcon class="h-5 w-5 text-white" />
            </div>
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <span class="text-sm font-medium text-gray-700">VentGPT</span>
                <span class="text-xs text-gray-500">typing...</span>
              </div>
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HeartIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const messagesContainer = ref(null)

const formatTime = (timestamp) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp))
}

// Auto-scroll to bottom when new messages arrive
watch(() => props.messages.length, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})

// Auto-scroll when loading state changes
watch(() => props.isLoading, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})
</script> 