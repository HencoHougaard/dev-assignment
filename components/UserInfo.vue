<script setup>
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
</script>

<template>
  <div v-if="user" class="mt-6 p-4 bg-gray-50 rounded-md animate-slide-in">
    <h3 class="text-lg font-semibold mb-3">ID Information:</h3>
    <dl class="grid grid-cols-2 gap-2">
      <template v-for="(value, key) in user" :key="key">
        <dt class="text-gray-600 animate-fade-in" :style="{ animationDelay: '100ms' }">
          {{ key.charAt(0).toUpperCase() + key.slice(1) }}:
        </dt>
        <dd class="font-medium animate-fade-in" :style="{ animationDelay: '200ms' }">
          {{ value }}
        </dd>
      </template>
    </dl>
  </div>
</template>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.4s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
  opacity: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>