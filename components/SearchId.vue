<script setup>
import { ref, computed } from 'vue'
import Button from './elements/Button.vue'
import { useUserStore } from '@/stores/userStore'

const idNumber = ref('')
const error = ref('')
const events = ref(null)
const userStore = useUserStore()
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

const getGender = (digit) => parseInt(digit) >= 5 ? 'Male' : 'Female'
const getResidentStatus = (digit) => parseInt(digit) === 0 ? 'South African Citizen' : 'Permanent Resident'
const formatBirthDate = (year, month, day) => {
  const fullYear = parseInt(year) > 21 ? `19${year}` : `20${year}`
  return `${day}/${month}/${fullYear}`
}

const validateSAID = (id) => {
  if (!id) return false

  // SA ID number must be 13 digits
  if (!/^\d{13}$/.test(id)) return false

  // Extract date components
  const year = parseInt(id.substring(0, 2))
  const month = parseInt(id.substring(2, 4))
  const day = parseInt(id.substring(4, 6))

  // Basic date validation
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false

  // Gender validation (7th digit: 0-4 female, 5-9 male)
  const genderDigit = parseInt(id.charAt(6))
  if (genderDigit < 0 || genderDigit > 9) return false

  // Luhn algorithm for check digit validation
  const digits = id.split('').map(Number)
  const checkDigit = digits.pop()
  const sum = digits
    .reverse()
    .map((digit, index) => {
      let value = digit * (index % 2 === 0 ? 2 : 1)
      if (value > 9) value -= 9
      return value
    })
    .reduce((acc, val) => acc + val, 0)

  const calculatedCheck = (10 - (sum % 10)) % 10
  return calculatedCheck === checkDigit
}

const handleSearch = async () => {
  error.value = ''
  userStore.setUser(null)

  if (!validateSAID(idNumber.value)) {
    error.value = 'Please enter a valid South African ID number'
    return
  }

  try {
    // Extract user information
    const birthYear = idNumber.value.substring(0, 2)
    const month = idNumber.value.substring(2, 4)
    const day = idNumber.value.substring(4, 6)
    const genderDigit = idNumber.value.charAt(6)
    const residentDigit = idNumber.value.charAt(10)

    userStore.setUser({
      birthDate: formatBirthDate(birthYear, month, day),
      gender: getGender(genderDigit),
      residentStatus: getResidentStatus(residentDigit)
    })

    const response = await fetch(`/api/events?month=${month}&day=${day}`)
    events.value = await response.json()
  } catch (err) {
    error.value = 'Failed to fetch events. Please try again.'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">Find Birthday Events</h2>
    <div class="space-y-4">
      <div class="relative">
        <input 
          type="text"
          :value="idNumber"
          @input="handleInput"
          placeholder="Enter South African ID number"
          maxlength="13"
          :class="[
            'w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300',
            inputShake ? 'animate-shake' : ''
          ]"
        />
        <label v-if="idNumber"
          class="absolute text-gray-500 text-sm bg-white px-1 transition-all duration-300 pointer-events-none"
          :class="[
            idNumber ? 
              'top-0 left-2 transform -translate-y-1/2 scale-90' : 
              'top-1/2 left-2 transform -translate-y-1/2 scale-100'
          ]"
        >
          South African ID Number
        </label>
        <div 
          class="absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300"
          :style="{ width: `${(idNumber.length / 13) * 100}%` }"
        ></div>
      </div>
      <p v-if="error" class="text-red-500 text-sm mt-1 animate-fade-in">{{ error }}</p>
      <Button :disabled="isButtonDisabled" @click="handleSearch" class="w-full">Search Events</Button>

      <UserInfo />

      <div v-if="events" class="mt-6 animate-fade-in">
        <h3 class="text-xl font-semibold mb-2">Special Events on Your Birthday:</h3>
        <ul class="list-disc pl-5 space-y-2">
          <li v-for="event in events" :key="event.id" class="text-gray-700">
            {{ event.name }}
          </li>
        </ul>
      </div>
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