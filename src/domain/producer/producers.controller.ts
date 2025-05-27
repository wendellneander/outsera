import { Request, Response } from 'express'
import { ProducersWithMinAndMaxAwardInterval } from './producers-with-min-and-max-award-interval.usecase'
import { IProducersController } from '.'
import { Logger } from '../../utils/logger'

export class ProducersController implements IProducersController {
  private logger: Logger
  constructor(
    readonly producersWithMinAndMaxAwardIntervalUseCase: ProducersWithMinAndMaxAwardInterval
  ) {
    this.logger = new Logger('ProducersController')
  }

  async getProducersWithMinAndMaxIntervals(
    _req: Request,
    res: Response
  ): Promise<void> {
    this.logger.info('Fetching producers with min and max award intervals')
    try {
      const producers =
        await this.producersWithMinAndMaxAwardIntervalUseCase.execute()
      res.status(200).json(producers)
    } catch (error) {
      this.logger.error('Error getting producer award intervals:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export class ProducersControllerFactory {
  static create(): ProducersController {
    const producersWithMinAndMaxAwardIntervalUseCase =
      new ProducersWithMinAndMaxAwardInterval()
    return new ProducersController(producersWithMinAndMaxAwardIntervalUseCase)
  }
}

export function createProducersController(): ProducersController {
  return ProducersControllerFactory.create()
}
