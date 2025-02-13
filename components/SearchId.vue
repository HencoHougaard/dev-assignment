<script setup>
import { ref } from 'vue'
import Button from './elements/Button.vue'
import { useUserStore } from '@/stores/userStore'

const idNumber = ref('')
const error = ref('')
const events = ref(null)
const userStore = useUserStore()

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
      <div>
        <input 
          type="text"
          v-model="idNumber"
          placeholder="Enter South African ID number"
          maxlength="13"
          class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
      </div>
      <Button @click="handleSearch" class="w-full">Search Events</Button>

      <UserInfo />

      <div v-if="events" class="mt-6">
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