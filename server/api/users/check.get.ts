import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { idNumber } = query

  if (!idNumber) {
    throw createError({
      statusCode: 400,
      message: 'ID number is required'
    })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { idNumber: String(idNumber) },
      include: {
        holidays: {
          select: {
            name: true,
            description: true,
            type: true,
            date: true
          }
        }
      }
    })

    if (!user) {
      return {
        exists: false,
        user: null,
        searchCount: 0,
        holidays: []
      }
    }

    return {
      exists: true,
      user: {
        ...user,
        holidays: user.holidays
      },
      searchCount: user.searchCount
    }
  } catch (error) {
    console.error('Error checking user:', error)
    throw createError({
      statusCode: 500,
      message: 'Error checking user existence'
    })
  }
})