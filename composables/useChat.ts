export const useChat = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedPersonality = ref<string | null>(null)

  const sendMessage = async (message: string, conversationHistory: any[] = []) => {
    if (!selectedPersonality.value) {
      error.value = 'Please select a personality first'
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/chat', {
        method: 'POST',
        body: {
          message,
          personality: selectedPersonality.value,
          conversationHistory
        }
      })

      return response
    } catch (err: any) {
      console.error('Chat API Error:', err)
      
      if (err.statusCode === 400) {
        error.value = err.statusMessage || 'Invalid request'
      } else if (err.statusCode === 500) {
        error.value = 'Server error. Please try again.'
      } else {
        error.value = 'Failed to send message. Please try again.'
      }
      
      return null
    } finally {
      isLoading.value = false
    }
  }

  const setPersonality = (personality: string) => {
    selectedPersonality.value = personality
  }

  const clearError = () => {
    error.value = null
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    selectedPersonality: readonly(selectedPersonality),
    sendMessage,
    setPersonality,
    clearError
  }
} 