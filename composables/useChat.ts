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
      console.log('Making API call to:', '/api/chat')
      console.log('Environment:', process.env.NODE_ENV)
      
      const response = await $fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          message,
          personality: selectedPersonality.value,
          conversationHistory
        }
      })

      console.log('API Response received:', response)
      return response
    } catch (err: any) {
      console.error('Chat API Error Details:', {
        error: err,
        status: err.status,
        statusCode: err.statusCode,
        statusMessage: err.statusMessage,
        data: err.data
      })
      
      if (err.status === 404 || err.statusCode === 404) {
        error.value = 'API endpoint not found. Please check deployment.'
      } else if (err.statusCode === 400) {
        error.value = err.statusMessage || 'Invalid request'
      } else if (err.statusCode === 500) {
        error.value = 'Server error. Please try again.'
      } else {
        error.value = `Failed to send message: ${err.statusMessage || err.message || 'Unknown error'}`
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