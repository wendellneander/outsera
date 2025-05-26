import { createApp, closeDatabase } from './app'

const PORT = process.env.PORT || 3000

async function startServer() {
  const app = await createApp()

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server')
    server.close(async () => {
      await closeDatabase()
      console.log('HTTP server closed')
    })
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
