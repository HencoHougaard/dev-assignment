import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: null,
        holidays: null,
        error: null,
        isLoading: false
    }),
    getters: {
        getUser: (state) => state.user,
        getHolidays: (state) => state.holidays,
        getError: (state) => state.error
    },
    actions: {
        setUser(user) {
            this.user = user
        },

        validateSAID(id) {
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
        },

        async handleUserSearch(idNumber) {
            this.isLoading = true
            this.error = null
            this.user = null
            this.holidays = null

            if (!this.validateSAID(idNumber)) {
                this.error = 'Please enter a valid South African ID number'
                this.isLoading = false
                return false
            }

            try {
                // Check if user exists first
                const checkResponse = await fetch(`/api/users/check?idNumber=${idNumber}`)
                const checkResult = await checkResponse.json()

                if (checkResult.exists) {
                    // User exists, use stored holidays
                    this.setUser({
                        ...checkResult.user,
                        searchCount: checkResult.searchCount
                    })
                    this.holidays = checkResult.user.holidays
                    
                    // Update search count
                    await fetch('/api/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            idNumber,
                            birthDate: checkResult.user.birthDate,
                            gender: checkResult.user.gender,
                            residentStatus: checkResult.user.residentStatus,
                            holidays: checkResult.user.holidays
                        })
                    })

                    return true
                }

                // User doesn't exist, proceed with new API call
                const birthYear = idNumber.substring(0, 2)
                const month = idNumber.substring(2, 4)
                const day = idNumber.substring(4, 6)
                const genderDigit = idNumber.charAt(6)
                const residentDigit = idNumber.charAt(10)

                const fullYear = parseInt(birthYear) > 21 ? `19${birthYear}` : `20${birthYear}`
                const dob = `${day}/${month}/${fullYear}`

                // Fetch holidays only for new users
                const fetchedHolidays = await this.fetchEvents(fullYear, month, day)

                const userData = {
                    idNumber,
                    birthDate: dob,
                    gender: this.getGender(genderDigit),
                    residentStatus: this.getResidentStatus(residentDigit),
                    holidays: fetchedHolidays
                }

                // Save new user data
                const userResponse = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                })

                if (!userResponse.ok) {
                    throw new Error('Failed to process user data')
                }

                const userResult = await userResponse.json()
                this.setUser({
                    ...userData,
                    searchCount: userResult.searchCount
                })

                return true
            } catch (error) {
                console.error('Error in handleUserSearch:', error)
                this.error = error.message || 'An error occurred. Please try again.'
                return false
            } finally {
                this.isLoading = false
            }
        },

        getGender(digit) {
            return parseInt(digit) >= 5 ? 'Male' : 'Female'
        },

        getResidentStatus(digit) {
            return parseInt(digit) === 0 ? 'South African Citizen' : 'Permanent Resident'
        },

        async fetchUser() {
            try {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                  })
                const user = await response.json()
                this.setUser({
                    ...user,
                    searchCount: user.searchCount
                  })
            } catch (error) {
                console.error('Error fetching user:', error)
            }
        },

        async fetchEvents(year, month, day) {
            try {
                const config = useRuntimeConfig()
                if (!config.public.calendarificApiKey) {
                    console.error('Missing Calendarific API key')
                    return []
                }
                
                const apiUrl = `https://calendarific.com/api/v2/holidays?api_key=${config.public.calendarificApiKey}&country=ZA&year=${year}`                
                const response = await fetch(apiUrl)
                const data = await response.json()
                
                if (!data.response?.holidays) {
                    console.error('Invalid API response structure:', data)
                    return []
                }

                this.holidays = data.response.holidays
                    .filter(holiday => {
                        const holidayDate = new Date(holiday.date.iso)
                        const targetMonth = holidayDate.getMonth() + 1 
                        const targetDay = holidayDate.getDate()
                        
                        const matches = targetMonth === parseInt(month) && targetDay === parseInt(day)
                        if (matches) {
                            console.log(`Found matching holiday: ${holiday.name} on ${holiday.date.iso}`)
                        }
                        return matches
                    })
                    .map(holiday => ({
                        name: holiday.name,
                        description: holiday.description || 'No description available',
                        type: Array.isArray(holiday.type) ? holiday.type[0] : holiday.primary_type || 'Holiday',
                        date: holiday.date.iso
                    }))

                return this.holidays
            } catch (error) {
                console.error('Error fetching holidays:', error)
                return []
            }
        },
    },
})