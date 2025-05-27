import {
  IProducersRepository,
  IProducersWithMinAndMaxAwardIntervalUseCase,
  ProducerWithMinAndMaxAwardIntervalOutput,
} from '.'
import { Logger } from '../../utils/logger'
import { ProducersRepository } from './producers.repository'

export class ProducersWithMinAndMaxAwardInterval
  implements IProducersWithMinAndMaxAwardIntervalUseCase
{
  private logger: Logger

  constructor(
    readonly producersRepository: IProducersRepository = new ProducersRepository()
  ) {
    this.logger = new Logger('ProducerWithMinAndMaxAwardInterval')
  }

  async execute(): Promise<ProducerWithMinAndMaxAwardIntervalOutput> {
    const [producersWithMinInterval, producersWithMaxInterval] =
      await Promise.all([
        this.producersRepository.findProducersWithMinAwardInterval(2),
        this.producersRepository.findProducersWithMaxAwardInterval(2),
      ])
    this.logger.info('Producers with min and max award interval', {
      producersWithMinInterval,
      producersWithMaxInterval,
    })

    return {
      min: producersWithMinInterval,
      max: producersWithMaxInterval,
    }
  }
}
