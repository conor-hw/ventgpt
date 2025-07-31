<template>
  <div class="text-center mb-8">
    <!-- Logo and Title -->
    <div class="flex items-center justify-center space-x-3 mb-4">
      <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
        <HeartIcon class="h-7 w-7 text-white" />
      </div>
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          VentGPT
        </h1>
        <p class="text-gray-600 text-sm">Your AI Mental Health Companion</p>
      </div>
    </div>
    
    <!-- Status and Disclaimer -->
    <div class="max-w-2xl mx-auto space-y-3">
      <div class="flex items-center justify-center space-x-2 text-sm text-green-600">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>AI Companion Online & Safe</span>
      </div>
      
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <div class="flex items-start space-x-2">
          <InformationCircleIcon class="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p class="font-medium mb-1">Important Notice</p>
            <p>VentGPT provides supportive conversation but is not a replacement for professional mental health services. In crisis situations, please contact emergency services or the numbers above.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HeartIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
</script> 