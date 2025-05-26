import express from 'express'
import prisma from './utils/prisma-client'

export async function createApp(): Promise<express.Application> {
  try {
    const app = express()
    app.use(express.json())

    return app
  } catch (error) {
    console.error('Error creating app:', error)
    throw error
  }
}

export async function closeDatabase(): Promise<void> {
  console.log('Disconnecting database...')
  await prisma.$disconnect()
  console.log('Database disconnected')
}
