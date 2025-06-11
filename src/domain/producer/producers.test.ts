import request from 'supertest'
import { createApp } from '../../app'
import { Application } from 'express'
import { initDatabase } from '../../database/client'
import { importDataFromCSV } from '../../utils/csv-importer'

describe('API Integration Tests', () => {
  let app: Application
  const CSV_FILE_PATH =
    process.env.CSV_PATH || 'src/database/data/movielist.csv'

  beforeAll(async () => {
    await initDatabase()
    await importDataFromCSV(CSV_FILE_PATH)
    app = await createApp()
  })

  describe('GET /api/producers/min-max-intervals', () => {
    it('should return the producers with min and max award intervals', async () => {
      const response = await request(app).get(
        '/api/producers/min-max-intervals'
      )

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('min')
      expect(response.body).toHaveProperty('max')

      expect(Array.isArray(response.body.min)).toBe(true)
      expect(response.body.min.length).toBeGreaterThanOrEqual(1)
      expect(response.body.min[0]).toHaveProperty('producer')
      expect(response.body.min[0]).toHaveProperty('interval')
      expect(response.body.min[0]).toHaveProperty('previousWin')
      expect(response.body.min[0]).toHaveProperty('followingWin')

      expect(response.body.max.length).toBeGreaterThanOrEqual(1)
      expect(Array.isArray(response.body.max)).toBe(true)
      expect(response.body.max[0]).toHaveProperty('producer')
      expect(response.body.max[0]).toHaveProperty('interval')
      expect(response.body.max[0]).toHaveProperty('previousWin')
      expect(response.body.max[0]).toHaveProperty('followingWin')

      expect(response.body).toEqual({
        min: [
          {
            producer: 'Joel Silver',
            interval: 1,
            previousWin: 1990,
            followingWin: 1991,
          },
        ],
        max: [
          {
            producer: 'Matthew Vaughn',
            interval: 13,
            previousWin: 2002,
            followingWin: 2015,
          },
        ],
      })
    })
  })
})
