<script setup>
import { ref, computed } from 'vue'
import Button from './elements/Button.vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'

const idNumber = ref('')
const userStore = useUserStore()
const { getError, isLoading } = storeToRefs(userStore)
const inputShake = ref(false)

const isButtonDisabled = computed(() => idNumber.value.length !== 13)

const handleInput = (event) => {
  const numericValue = event.target.value.replace(/[^0-9]/g, '')
  if (numericValue !== event.target.value) {
    inputShake.value = true
    setTimeout(() => {
      inputShake.value = false
    }, 500)
  }
  idNumber.value = numericValue
}

const handleSearch = async () => {
  await userStore.handleUserSearch(idNumber.value)
}
</script>

<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl text-center text-primary font-bold mb-4">Find Birthday Events</h2>
    <div class="space-y-4">
      <div class="relative">
        <input 
          type="text"
          :value="idNumber"
          @input="handleInput"
          placeholder="Enter South African ID number"
          maxlength="13"
          :class="[
            'w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 text-primary placeholder-secondary',
            inputShake ? 'animate-shake' : ''
          ]"
        />
        <label v-if="idNumber"
          class="absolute text-secondary text-sm bg-white px-1 transition-all duration-300 pointer-events-none"
          :class="[
            idNumber ? 
              'top-0 left-2 transform -translate-y-1/2 scale-90' : 
              'top-1/2 left-2 transform -translate-y-1/2 scale-100'
          ]"
        >
          South African ID Number
        </label>
        <div 
          class="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300"
          :style="{ width: `${(idNumber.length / 13) * 100}%` }"
        ></div>
      </div>
      <p v-if="getError" class="text-red-500 text-sm mt-1 animate-fade-in">{{ getError }}</p>
      <Button :disabled="isButtonDisabled || isLoading" @click="handleSearch" class="w-full">
        {{ isLoading ? 'Searching...' : 'Search Events' }}
      </Button>
      <UserInfo />
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-3px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(3px, 0, 0);
  }
}
</style>