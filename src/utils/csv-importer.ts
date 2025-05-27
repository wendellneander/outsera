import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import prisma from './prisma-client'
import { Logger } from './logger'

type MovieCSV = {
  year: string
  title: string
  studios: string
  producers: string
  winner?: string
}

class NameExtractor {
  process(namesString: string): string[] {
    return namesString
      .replace(/,?\s+and\s+\s*/, ',')
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
  }
}

class DatabaseRepository {
  private logger: Logger

  constructor() {
    this.logger = new Logger('DatabaseRepository')
  }

  async clearDatabase(): Promise<void> {
    this.logger.info('Cleaning the database')

    try {
      await prisma.movieProducer.deleteMany({})
      await prisma.movieStudio.deleteMany({})
      await prisma.movie.deleteMany({})
      await prisma.producer.deleteMany({})
      await prisma.studio.deleteMany({})
      await prisma.$executeRaw`delete from sqlite_sequence;`
      this.logger.info('Movies cleared successfully')
    } catch (error) {
      this.logger.error('Error cleaning database:', error)
      throw error
    }
  }

  async createMovies(movies: any[]): Promise<void> {
    this.logger.debug('Creating movies in bulk:', movies.length)
    await prisma.movie.createMany({ data: movies })
  }

  async createProducers(producers: any[]): Promise<void> {
    this.logger.debug('Creating producers in bulk:', producers.length)
    await prisma.producer.createMany({ data: producers })
  }

  async createStudios(studios: any[]): Promise<void> {
    this.logger.debug('Creating studios in bulk:', studios.length)
    await prisma.studio.createMany({ data: studios })
  }

  async getProducerIds(names: string[]): Promise<any[]> {
    return prisma.producer.findMany({
      where: { name: { in: names } },
      select: { id: true, name: true },
    })
  }

  async getStudioIds(names: string[]): Promise<any[]> {
    return prisma.studio.findMany({
      where: { name: { in: names } },
      select: { id: true, name: true },
    })
  }

  async createMovieProducerRelations(relations: any[]): Promise<void> {
    this.logger.debug(
      'Creating movie-producer relations in bulk:',
      relations.length
    )
    await prisma.movieProducer.createMany({ data: relations })
  }

  async createMovieStudioRelations(relations: any[]): Promise<void> {
    this.logger.debug(
      'Creating movie-studio relations in bulk:',
      relations.length
    )
    await prisma.movieStudio.createMany({ data: relations })
  }
}

class MovieDataFactory {
  createMovieData(item: MovieCSV): any {
    return {
      year: parseInt(item.year),
      title: item.title,
      winner: item.winner?.toLowerCase() === 'yes',
    }
  }

  createProducerData(name: string): any {
    return { name }
  }

  createStudioData(name: string): any {
    return { name }
  }

  createMovieProducerRelation(movieId: number, producerId: number): any {
    return { movieId, producerId }
  }

  createMovieStudioRelation(movieId: number, studioId: number): any {
    return { movieId, studioId }
  }
}

export class CSVImporter {
  private logger: Logger
  private repository: DatabaseRepository
  private nameExtractor: NameExtractor
  private dataFactory: MovieDataFactory

  constructor() {
    this.logger = new Logger('CSVImporter')
    this.repository = new DatabaseRepository()
    this.nameExtractor = new NameExtractor()
    this.dataFactory = new MovieDataFactory()
  }

  async importDataFromCSV(filePath: string): Promise<void> {
    this.logger.info('Importing movies from csv: ', filePath)

    if (!fs.existsSync(filePath)) {
      throw new Error(`CSV file not found: ${filePath}`)
    }

    const results: MovieCSV[] = []

    return new Promise((resolve, reject) => {
      fs.createReadStream(path.resolve(filePath))
        .pipe(csv({ separator: ';' }))
        .on('data', (data: MovieCSV) => results.push(data))
        .on('end', async () => {
          try {
            this.logger.debug(
              'CSV parsing completed, total records:',
              results.length
            )
            await this.repository.clearDatabase()
            await this.processData(results)
            resolve()
          } catch (error) {
            this.logger.error('Error processing CSV data:', error)
            reject(error)
          }
        })
        .on('error', (error: any) => {
          this.logger.error('Error reading CSV file:', error)
          reject(error)
        })
    })
  }

  private async processData(results: MovieCSV[]): Promise<void> {
    try {
      this.logger.debug('Processing data, total records:', results.length)

      const moviesToCreate = []
      const producerNames = new Set<string>()
      const studioNames = new Set<string>()
      const movieProducerRelations: {
        movieId: number
        producerName: string
      }[] = []
      const movieStudioRelations: { movieId: number; studioName: string }[] = []

      // Process each movie
      for (const item of results) {
        const movieData = this.dataFactory.createMovieData(item)
        moviesToCreate.push(movieData)

        this.logger.debug(
          `Processing producers and studios for movie: ${item.title} (${item.year})`
        )
        // Process producers
        const producers = this.nameExtractor.process(item.producers)
        producers.forEach((producerName) => {
          producerNames.add(producerName)
          movieProducerRelations.push({
            movieId: moviesToCreate.length,
            producerName: producerName,
          })
        })

        // Process studios
        const studios = this.nameExtractor.process(item.studios)
        studios.forEach((studioName) => {
          studioNames.add(studioName)
          movieStudioRelations.push({
            movieId: moviesToCreate.length,
            studioName: studioName,
          })
        })
      }

      // Create movies in bulk
      await this.repository.createMovies(moviesToCreate)

      // Create producers in bulk
      const producersToCreate = Array.from(producerNames).map((name) =>
        this.dataFactory.createProducerData(name)
      )
      await this.repository.createProducers(producersToCreate)

      // Create studios in bulk
      const studiosToCreate = Array.from(studioNames).map((name) =>
        this.dataFactory.createStudioData(name)
      )
      await this.repository.createStudios(studiosToCreate)

      // Fetch producer and studio IDs
      const producerIds = await this.repository.getProducerIds(
        Array.from(producerNames)
      )
      const studioIds = await this.repository.getStudioIds(
        Array.from(studioNames)
      )

      // Create movie-producer relations in bulk
      const movieProducerData = movieProducerRelations.map((relation) => {
        const producer = producerIds.find(
          (p) => p.name === relation.producerName
        )
        return this.dataFactory.createMovieProducerRelation(
          relation.movieId,
          producer!.id
        )
      })
      await this.repository.createMovieProducerRelations(movieProducerData)

      // Create movie-studio relations in bulk
      const movieStudioData = movieStudioRelations.map((relation) => {
        const studio = studioIds.find((s) => s.name === relation.studioName)
        return this.dataFactory.createMovieStudioRelation(
          relation.movieId,
          studio!.id
        )
      })
      await this.repository.createMovieStudioRelations(movieStudioData)

      this.logger.debug(`${results.length} movies loaded from CSV`)
    } catch (error) {
      this.logger.error('Error saving movies to database:', error)
      throw error
    }
  }
}

export async function importDataFromCSV(filePath: string): Promise<void> {
  const loader = new CSVImporter()
  await loader.importDataFromCSV(filePath)
}
