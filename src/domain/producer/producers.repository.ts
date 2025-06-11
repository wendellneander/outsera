import { IProducersRepository, ProducerInterval } from '.'
import { db } from '../../database/client'
import { Logger } from '../../utils/logger'
import { sql } from 'drizzle-orm'

export class ProducersRepository implements IProducersRepository {
  private logger: Logger

  constructor() {
    this.logger = new Logger('ProducersRepository')
  }

  async findProducersWithMinAndMaxAwardInterval(): Promise<
    ProducerInterval[] | null
  > {
    this.logger.info('Finding producers with maximum award interval')

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
      ),
      intervals AS (
        SELECT 
          producerName AS producer,
          interval,
          previous_win AS previousWin,
          current_win AS followingWin
        FROM 
          consecutive_wins
        WHERE 
          interval IS NOT NULL
      )
      SELECT 
        'min' AS type,
        producer,
        interval,
        previousWin,
        followingWin
      FROM intervals
      WHERE interval = (SELECT MIN(interval) FROM intervals)

      UNION ALL

      SELECT 
        'max' AS type,
        producer,
        interval,
        previousWin,
        followingWin
      FROM intervals
      WHERE interval = (SELECT MAX(interval) FROM intervals);
    `)

    this.logger.info('Query executed successfully', { result })

    if (!Array.isArray(result?.rows) || result?.rows.length === 0) {
      return null
    }

    return result?.rows.map((row: any) => ({
      type: row.type,
      producer: row.producer,
      interval: Number(row.interval),
      previousWin: Number(row.previousWin),
      followingWin: Number(row.followingWin),
    }))
  }
}
