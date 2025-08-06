<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <h1 class="text-2xl font-bold mb-6">VentGPT API Debug</h1>
      
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Environment Info</h2>
        <div class="space-y-2 text-sm font-mono">
          <div>Environment: {{ $config.public.appName || 'Not set' }}</div>
          <div>Current URL: {{ currentUrl }}</div>
          <div>API Endpoint: {{ apiEndpoint }}</div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Test API Connection</h2>
        <button 
          @click="testApi"
          :disabled="testing"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {{ testing ? 'Testing...' : 'Test API' }}
        </button>
      </div>

      <div v-if="result" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Result</h2>
        <pre class="text-sm bg-gray-100 p-4 rounded overflow-auto">{{ JSON.stringify(result, null, 2) }}</pre>
      </div>

      <div v-if="errorDetails" class="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
        <h2 class="text-lg font-semibold mb-4 text-red-800">Error Details</h2>
        <pre class="text-sm bg-red-100 p-4 rounded overflow-auto text-red-800">{{ JSON.stringify(errorDetails, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $config } = useNuxtApp()

const testing = ref(false)
const result = ref(null)
const errorDetails = ref(null)

const currentUrl = ref('')
const apiEndpoint = ref('')

onMounted(() => {
  currentUrl.value = window.location.origin
  apiEndpoint.value = `${window.location.origin}/api/chat`
})

const testApi = async () => {
  testing.value = true
  result.value = null
  errorDetails.value = null

  try {
    console.log('Testing API at:', '/api/chat')
    
    const response = await $fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        message: 'Hello, this is a test message',
        personality: 'supportive-friend',
        conversationHistory: []
      }
    })

    result.value = {
      success: true,
      response: response
    }
  } catch (error) {
    console.error('API Test Error:', error)
    
    errorDetails.value = {
      success: false,
      error: {
        message: error.message,
        status: error.status,
        statusCode: error.statusCode,
        statusMessage: error.statusMessage,
        data: error.data,
        stack: error.stack
      }
    }
  } finally {
    testing.value = false
  }
}
</script> 