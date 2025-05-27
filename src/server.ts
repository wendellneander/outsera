import { createApp } from './app'
import { importDataFromCSV } from './utils/csv-importer'
import { Logger } from './utils/logger'

const PORT = process.env.PORT || 3000

const logger = new Logger('Server')

async function startServer() {
  try {
    await importDataFromCSV('src/database/data/movielist.csv')

    const app = await createApp()
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
