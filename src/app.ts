import express from 'express'
import prisma from './utils/prisma-client'

export const createApp = async (): Promise<express.Application> => {
  try {
    const app = express()
    app.use(express.json())

    return app
  } catch (error) {
    console.error('Error creating app:', error)
    throw error
  }
}

export const closeDatabase = async (): Promise<void> => {
  await prisma.$disconnect()
}
