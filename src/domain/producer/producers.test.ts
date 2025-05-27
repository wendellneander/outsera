import request from 'supertest'
import { createApp } from '../../app'
import { Application } from 'express'

describe('API Integration Tests', () => {
  let app: Application

  beforeAll(async () => {
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
          {
            producer: 'Bo Derek',
            interval: 6,
            previousWin: 1984,
            followingWin: 1990,
          },
        ],
        max: [
          {
            producer: 'Matthew Vaughn',
            interval: 13,
            previousWin: 2002,
            followingWin: 2015,
          },
          {
            producer: 'Buzz Feitshans',
            interval: 9,
            previousWin: 1985,
            followingWin: 1994,
          },
        ],
      })
    })
  })
})
