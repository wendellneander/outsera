import { Movie } from '@prisma/client'
import { IMovieRepository } from '.'
import prisma from '../../utils/prisma-client'

export class MovieRepository implements IMovieRepository {
  async findAllWinners(): Promise<Movie[]> {
    return prisma.movie.findMany({
      where: { winner: true },
      orderBy: { year: 'asc' },
    })
  }
}
