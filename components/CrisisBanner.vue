<template>
  <div class="bg-red-50 border-b border-red-200">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-600" />
          <span class="text-red-800 text-sm font-medium">
            Crisis Support Available 24/7
          </span>
          <div class="flex space-x-4 text-sm">
            <a href="tel:116123" class="text-red-700 hover:text-red-900 font-semibold">
              Samaritans: 116 123
            </a>
            <a href="tel:999" class="text-red-700 hover:text-red-900 font-semibold">
              Emergency: 999
            </a>
          </div>
        </div>
        <button
          @click="showServices = !showServices"
          class="text-red-700 hover:text-red-900 text-sm font-medium"
        >
          {{ showServices ? 'Hide' : 'More Services' }}
        </button>
      </div>
      
      <!-- Expandable Services List -->
      <div v-if="showServices" class="mt-3 pt-3 border-t border-red-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 class="font-semibold text-red-800 mb-1">Ireland</h4>
            <div class="space-y-1">
              <div>HSE: <a href="tel:1800111888" class="text-red-700 hover:underline">1800 111 888</a></div>
              <div>Pieta: <a href="tel:1800247247" class="text-red-700 hover:underline">1800 247 247</a></div>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-red-800 mb-1">Text Support</h4>
            <div class="space-y-1">
              <div>Text HELLO to <span class="font-mono">50808</span></div>
              <div>Text HELP to <span class="font-mono">51444</span></div>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-red-800 mb-1">Online</h4>
            <div class="space-y-1">
              <a href="https://samaritans.ie" target="_blank" class="text-red-700 hover:underline block">samaritans.ie</a>
              <a href="https://pieta.ie" target="_blank" class="text-red-700 hover:underline block">pieta.ie</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const showServices = ref(false)
</script> 