<template>
  <div class="max-w-4xl mx-auto mb-8">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-2">Choose Your AI Companion</h2>
      <p class="text-gray-600">Select a personality that feels right for you today</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="personality in personalities"
        :key="personality.id"
        @click="selectPersonality(personality)"
        class="personality-card group"
      >
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
               :class="personality.bgColor">
            <component :is="personality.icon" class="h-8 w-8 text-white" />
          </div>
          <h3 class="font-semibold text-gray-800 mb-2">{{ personality.name }}</h3>
          <p class="text-sm text-gray-600 mb-3">{{ personality.description }}</p>
          <div class="text-xs text-gray-500 space-y-1">
            <div class="flex items-center justify-center space-x-1">
              <span class="font-medium">Approach:</span>
              <span>{{ personality.approach }}</span>
            </div>
            <div class="flex items-center justify-center space-x-1">
              <span class="font-medium">Tone:</span>
              <span>{{ personality.tone }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  SparklesIcon, 
  LightBulbIcon 
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['select'])

const personalities = [
  {
    id: 'supportive-friend',
    name: 'Supportive Friend',
    description: 'Warm, understanding, and encouraging like a close friend',
    approach: 'Empathetic listening',
    tone: 'Casual & caring',
    bgColor: 'bg-gradient-to-br from-pink-500 to-rose-500',
    icon: UserGroupIcon,
    introduction: 'I\'m here to listen without judgment and offer the kind of support a good friend would. Let\'s talk about whatever\'s on your mind.'
  },
  {
    id: 'professional-counselor',
    name: 'Professional Counselor',
    description: 'Structured, therapeutic approach with gentle guidance',
    approach: 'Solution-focused',
    tone: 'Professional & warm',
    bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-500',
    icon: AcademicCapIcon,
    introduction: 'I use evidence-based approaches to help you explore your thoughts and feelings. Together, we can work through what you\'re experiencing.'
  },
  {
    id: 'mindfulness-guide',
    name: 'Mindfulness Guide',
    description: 'Focus on present moment awareness and inner peace',
    approach: 'Mindfulness-based',
    tone: 'Calm & centered',
    bgColor: 'bg-gradient-to-br from-green-500 to-emerald-500',
    icon: SparklesIcon,
    introduction: 'Let\'s explore mindfulness and self-awareness together. I\'ll help you find moments of peace and clarity in your daily experience.'
  },
  {
    id: 'problem-solver',
    name: 'Problem Solver',
    description: 'Practical, action-oriented support for challenges',
    approach: 'Solution-oriented',
    tone: 'Direct & helpful',
    bgColor: 'bg-gradient-to-br from-orange-500 to-amber-500',
    icon: LightBulbIcon,
    introduction: 'I\'m here to help you break down challenges into manageable steps. Let\'s work together to find practical solutions that work for you.'
  }
]

const selectPersonality = (personality) => {
  emit('select', personality)
}
</script> 