import { closeDatabase } from '../app'
import { loadDataFromCSV } from '../utils/csv-loader'

async function importCsv() {
  try {
    const args = process.argv.slice(2)

    if (args.length === 0) {
      console.error('Error: No CSV file specified')
      console.log('Usage: npm run import:csv -- <path-to-csv-file>')
      process.exit(1)
    }

    const csvFilePath = args[0]
    console.log(`Importing data from ${csvFilePath}...`)

    await loadDataFromCSV(csvFilePath)

    console.log('CSV import completed successfully')
  } catch (error) {
    console.error('Error importing CSV:', error)
    process.exit(1)
  } finally {
    await closeDatabase()
  }
}

importCsv()
