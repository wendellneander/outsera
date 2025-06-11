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
    this.logger.info(
      'Executing use case to find producers with min and max award intervals'
    )

    const producers =
      await this.producersRepository.findProducersWithMinAndMaxAwardInterval()

    this.logger.info('Producers with min and max award intervals found', {
      producers,
    })

    const groupByType = (type: 'min' | 'max') =>
      producers
        ?.filter((producer) => producer.type === type)
        .map(({ type, ...rest }) => rest) || []

    return {
      min: groupByType('min'),
      max: groupByType('max'),
    }
  }
}
