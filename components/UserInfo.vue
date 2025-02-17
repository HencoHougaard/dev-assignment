<script setup>
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { getUser, getHolidays, isLoading } = storeToRefs(userStore)
</script>

<template>
  <div v-if="getUser" class="space-y-6">
    <div class="p-4 bg-accent rounded-md animate-slide-in">
      <h3 class="text-lg font-semibold mb-3">ID Information:</h3>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <div class="text-secondary animate-fade-in" :style="{ animationDelay: '100ms' }">
            ID Number:
          </div>
          <div class="text-secondary animate-fade-in" :style="{ animationDelay: '100ms' }">
            Birth Date:
          </div>
          <div class="text-secondary animate-fade-in" :style="{ animationDelay: '100ms' }">
            Gender:
          </div>
          <div class="text-secondary animate-fade-in" :style="{ animationDelay: '100ms' }">
            Citizenship:
          </div>
        </div>
        <div>
          <div class="font-medium animate-fade-in" :style="{ animationDelay: '200ms' }">
            {{ getUser.idNumber }}
          </div>
          <div class="font-medium animate-fade-in" :style="{ animationDelay: '200ms' }">
            {{ getUser.birthDate }}
          </div>
          <div class="font-medium animate-fade-in" :style="{ animationDelay: '200ms' }">
            {{ getUser.gender }}
          </div>
          <div class="font-medium animate-fade-in" :style="{ animationDelay: '200ms' }">
            {{ getUser.residentStatus }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center p-4">
      <div class="animate-pulse text-secondary">Loading holidays...</div>
    </div>

    <template v-else>
      <div v-if="getHolidays?.length" class="p-4 bg-accent rounded-md animate-slide-in">
        <h3 class="text-lg font-semibold mb-3">Birthday Holidays:</h3>
        <ul class="space-y-4">
          <li v-for="holiday in getHolidays" :key="holiday.name" 
              class="animate-fade-in bg-white p-3 rounded shadow-sm">
            <h4 class="font-medium text-primary">{{ holiday.name }}</h4>
            <p class="text-sm text-secondary mt-1">{{ holiday.description }}</p>
            <div class="flex gap-2">
              <span class="inline-block mt-2 text-xs bg-accent text-primary px-2 py-1 rounded">
              {{ holiday.type }}
            </span>
            <span class="inline-block mt-2 text-xs bg-accent text-primary px-2 py-1 rounded">
              {{ holiday.date }}
            </span>
            </div>
          </li>
        </ul>
      </div>
      <div v-else-if="getUser" class="p-4 bg-accent rounded-md animate-slide-in">
        <h3 class="text-lg font-semibold mb-3">Birthday Holidays:</h3>
        <p class="text-secondary animate-fade-in">No holidays found for this birth date</p>
      </div>
    </template>
    
    <div v-if="getUser.searchCount" class="text-sm text-secondary animate-fade-in text-center">
      This ID has been searched {{ getUser.searchCount }} {{ getUser.searchCount === 1 ? 'time' : 'times' }}
    </div>
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