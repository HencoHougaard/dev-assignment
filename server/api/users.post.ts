import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { idNumber, birthDate, gender, residentStatus, holidays } = body

    // First, check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { idNumber },
      include: { holidays: true }
    })

    if (existingUser) {
      // Update search count and holidays for existing user
      const updatedUser = await prisma.user.update({
        where: { idNumber },
        data: {
          searchCount: {
            increment: 1
          },
          holidays: {
            deleteMany: {}, // Remove old holidays
            create: holidays || [] // Add new holidays
          }
        },
        include: { holidays: true }
      })
      return {
        ...updatedUser,
        isNewUser: false
      }
    }

    // Create new user if doesn't exist
    const newUser = await prisma.user.create({
      data: {
        idNumber,
        birthDate,
        gender,
        residentStatus,
        searchCount: 1,
        holidays: {
          create: holidays || []
        }
      },
      include: { holidays: true }
    })

    return {
      ...newUser,
      isNewUser: true
    }
  } catch (error) {
    console.error('Database error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Error processing user data'
    })
  }
})