import { createApp } from './app'
import { initDatabase } from './database/client'
import { importDataFromCSV } from './utils/csv-importer'
import { Logger } from './utils/logger'

const PORT = process.env.PORT || 3000
const CSV_FILE_PATH = process.env.CSV_PATH || 'src/database/data/movielist.csv'

const logger = new Logger('Server')

async function startServer() {
  try {
    await initDatabase()

    await importDataFromCSV(CSV_FILE_PATH)

    const app = await createApp()
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
      logger.info(`Available routes:`)
      app._router.stack.forEach((route: any) => {
        if (route.route) {
          const methods = Object.keys(route.route.methods)
            .join(', ')
            .toUpperCase()
          logger.info(`- ${methods} ${route.route.path}`)
        }
      })
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
