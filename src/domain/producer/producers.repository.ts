import { IProducersRepository, ProducerInterval } from '.'
import { db } from '../../database/client'
import { Logger } from '../../utils/logger'
import { sql } from 'drizzle-orm'

export class ProducersRepository implements IProducersRepository {
  private logger: Logger

  constructor() {
    this.logger = new Logger('ProducersRepository')
  }

  async findProducersWithMinAwardInterval(
    limit: number
  ): Promise<ProducerInterval[] | null> {
    this.logger.info('Finding producers with minimum award interval', { limit })

    const result = await db.run(sql`
      WITH producer_wins AS (
        SELECT 
          p.id AS producerId,
          p.name AS producerName,
          m.year
        FROM 
          producers p
          JOIN movie_producers mp ON p.id = mp.producerId
          JOIN movies m ON mp.movieId = m.id
        WHERE 
          m.winner = 1
        ORDER BY 
          p.name, m.year
      ),
      consecutive_wins AS (
        SELECT 
          producerId,
          producerName,
          year AS current_win,
          LAG(year) OVER (PARTITION BY producerId ORDER BY year) AS previous_win,
          year - LAG(year) OVER (PARTITION BY producerId ORDER BY year) AS interval
        FROM 
          producer_wins
      )
      SELECT 
        producerName AS producer,
        MIN(interval) AS interval,
        previous_win AS previousWin,
        current_win AS followingWin
      FROM 
        consecutive_wins
      WHERE 
        interval IS NOT NULL
      GROUP BY 
        producerId
      ORDER BY 
        interval
      LIMIT ${limit};
    `)

    this.logger.info('Query executed successfully', { result })

    if (!Array.isArray(result?.rows) || result?.rows.length === 0) {
      return null
    }

    return result?.rows.map((row: any) => ({
      producer: row.producer,
      interval: Number(row.interval),
      previousWin: Number(row.previousWin),
      followingWin: Number(row.followingWin),
    }))
  }

  async findProducersWithMaxAwardInterval(
    limit: number
  ): Promise<ProducerInterval[] | null> {
    this.logger.info('Finding producers with maximum award interval', { limit })

    const result = await db.run(sql`
      WITH producer_wins AS (
        SELECT 
          p.id AS producerId,
          p.name AS producerName,
          m.year
        FROM 
          producers p
          JOIN movie_producers mp ON p.id = mp.producerId
          JOIN movies m ON mp.movieId = m.id
        WHERE 
          m.winner = 1
        ORDER BY 
          p.name, m.year
      ),
      consecutive_wins AS (
        SELECT 
          producerId,
          producerName,
          year AS current_win,
          LAG(year) OVER (PARTITION BY producerId ORDER BY year) AS previous_win,
          year - LAG(year) OVER (PARTITION BY producerId ORDER BY year) AS interval
        FROM 
          producer_wins
      )
      SELECT 
        producerName AS producer,
        MAX(interval) AS interval,
        previous_win AS previousWin,
        current_win AS followingWin
      FROM 
        consecutive_wins
      WHERE 
        interval IS NOT NULL
      GROUP BY 
        producerId
      ORDER BY 
        interval DESC
      LIMIT ${limit};
    `)

    this.logger.info('Query executed successfully', { result })

    if (!Array.isArray(result?.rows) || result?.rows.length === 0) {
      return null
    }

    return result?.rows.map((row: any) => ({
      producer: row.producer,
      interval: Number(row.interval),
      previousWin: Number(row.previousWin),
      followingWin: Number(row.followingWin),
    }))
  }
}
