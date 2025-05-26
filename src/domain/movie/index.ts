import { Movie } from '@prisma/client'

export interface ProducerInterval {
  producer: string
  interval: number
  previousWin: number
  followingWin: number
}

export interface AwardIntervals {
  min: ProducerInterval[]
  max: ProducerInterval[]
}

export interface IMovieRepository {
  findAllWinners(): Promise<Movie[]>
}
