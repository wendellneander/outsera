import { sqliteTable, integer, text, primaryKey } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const movies = sqliteTable('movies', {
  id: integer().primaryKey({ autoIncrement: true }),
  year: integer().notNull(),
  title: text().notNull(),
  winner: integer({ mode: 'boolean' }).notNull().default(false),
})

export const producers = sqliteTable('producers', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
})

export const studios = sqliteTable('studios', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
})

export const movieProducers = sqliteTable(
  'movie_producers',
  {
    movieId: integer().notNull(),
    producerId: integer().notNull(),
  },
  (table) => [primaryKey({ columns: [table.movieId, table.producerId] })]
)

export const movieStudios = sqliteTable(
  'movie_studios',
  {
    movieId: integer().notNull(),
    studioId: integer().notNull(),
  },
  (table) => [primaryKey({ columns: [table.movieId, table.studioId] })]
)

export const moviesRelations = relations(movies, ({ many }) => ({
  producers: many(movieProducers),
  studios: many(movieStudios),
}))

export const producersRelations = relations(producers, ({ many }) => ({
  movies: many(movieProducers),
}))

export const studiosRelations = relations(studios, ({ many }) => ({
  movies: many(movieStudios),
}))

export const movieProducersRelations = relations(movieProducers, ({ one }) => ({
  movie: one(movies, {
    fields: [movieProducers.movieId],
    references: [movies.id],
  }),
  producer: one(producers, {
    fields: [movieProducers.producerId],
    references: [producers.id],
  }),
}))

export const movieStudiosRelations = relations(movieStudios, ({ one }) => ({
  movie: one(movies, {
    fields: [movieStudios.movieId],
    references: [movies.id],
  }),
  studio: one(studios, {
    fields: [movieStudios.studioId],
    references: [studios.id],
  }),
}))
