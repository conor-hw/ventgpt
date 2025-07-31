<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
      <div class="relative">
        <textarea
          v-model="message"
          @keydown="handleKeydown"
          :disabled="disabled"
          placeholder="Share what's on your mind... (Press Shift+Enter for new line, Enter to send)"
          class="chat-input"
          rows="3"
          ref="textarea"
        ></textarea>
        
        <!-- Send Button -->
        <button
          @click="sendMessage"
          :disabled="!canSend"
          class="absolute bottom-3 right-3 p-2 rounded-xl transition-all duration-200"
          :class="canSend 
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
        >
          <PaperAirplaneIcon class="h-5 w-5" />
        </button>
      </div>
      
      <!-- Footer with helpful hints -->
      <div class="flex items-center justify-between mt-3 text-xs text-gray-500">
        <div class="flex items-center space-x-4">
          <span>💝 Completely confidential</span>
          <span>🔒 No data stored</span>
          <span>⚡ Real-time support</span>
        </div>
        <div class="flex items-center space-x-2">
          <span>{{ message.length }}/1000</span>
          <button
            v-if="message.length > 0"
            @click="clearMessage"
            class="text-gray-400 hover:text-gray-600"
            title="Clear message"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Emergency Help Button -->
    <div class="text-center mt-4">
      <button
        @click="showEmergencyHelp"
        class="inline-flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
      >
        <ExclamationTriangleIcon class="h-4 w-4" />
        <span>Need immediate help?</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { PaperAirplaneIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['send'])

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const message = ref('')
const textarea = ref(null)

const canSend = computed(() => {
  return message.value.trim().length > 0 && 
         message.value.length <= 1000 && 
         !props.disabled
})

const sendMessage = () => {
  if (canSend.value) {
    emit('send', message.value)
    message.value = ''
    // Reset textarea height
    if (textarea.value) {
      textarea.value.style.height = 'auto'
    }
  }
}

const clearMessage = () => {
  message.value = ''
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.focus()
  }
}

const handleKeydown = (event) => {
  // Send on Enter (but not Shift+Enter)
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
  
  // Auto-resize textarea
  nextTick(() => {
    if (textarea.value) {
      textarea.value.style.height = 'auto'
      textarea.value.style.height = Math.min(textarea.value.scrollHeight, 150) + 'px'
    }
  })
}

const showEmergencyHelp = () => {
  // This could trigger a modal or redirect to crisis resources
  alert('Emergency Resources:\n\nSamaritans: 116 123\nEmergency Services: 999\nHSE Mental Health: 1800 111 888\n\nIf you are in immediate danger, please call emergency services.')
}

// Auto-focus the textarea when component mounts
onMounted(() => {
  if (textarea.value) {
    textarea.value.focus()
  }
})
</script> 