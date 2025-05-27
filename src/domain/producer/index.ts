import { Request, Response } from 'express'

export type ProducerInterval = {
  producer: string
  interval: number
  previousWin: number
  followingWin: number
}

export interface IProducersRepository {
  findProducersWithMaxAwardInterval(
    limit: number
  ): Promise<ProducerInterval[] | null>
  findProducersWithMinAwardInterval(
    limit: number
  ): Promise<ProducerInterval[] | null>
}

export interface IProducersController {
  getProducersWithMinAndMaxIntervals(req: Request, res: Response): Promise<void>
}

export interface IProducersWithMinAndMaxAwardIntervalUseCase {
  execute(): Promise<ProducerWithMinAndMaxAwardIntervalOutput>
}

export interface ProducerWithMinAndMaxAwardIntervalOutput {
  min: ProducerInterval[] | null
  max: ProducerInterval[] | null
}
