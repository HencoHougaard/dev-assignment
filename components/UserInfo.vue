<script setup>
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

const { user } = storeToRefs(userStore)
</script>

<template>
  <div v-if="user" class="mt-6 p-4 bg-gray-50 rounded-md">
    <h3 class="text-lg font-semibold mb-3">ID Information:</h3>
    <dl class="grid grid-cols-2 gap-2">
      <dt class="text-gray-600">Birth Date:</dt>
      <dd class="font-medium">{{ user.birthDate }}</dd>

      <dt class="text-gray-600">Gender:</dt>
      <dd class="font-medium">{{ user.gender }}</dd>

      <dt class="text-gray-600">Status:</dt>
      <dd class="font-medium">{{ user.residentStatus }}</dd>
    </dl>
  </div>
</template>