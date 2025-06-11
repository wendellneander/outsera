import { drizzle } from 'drizzle-orm/libsql/node'

export const db = drizzle('file::memory:?cache=shared')

export async function initDatabase() {
  try {
    await Promise.all([
      db.run(`CREATE TABLE movies (
            id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
            year integer NOT NULL,
            title text NOT NULL,
            winner integer DEFAULT false NOT NULL
        );`),
      db.run(`CREATE TABLE producers (
            id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
            name text NOT NULL
        );`),
      db.run(` CREATE TABLE studios (
            id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
            name text NOT NULL
        );`),
    ])
    await Promise.all([
      db.run(`CREATE TABLE movie_producers (
            movieId integer NOT NULL,
            producerId integer NOT NULL,
            PRIMARY KEY(movieId, producerId)
        );`),
      db.run(` CREATE TABLE movie_studios (
            movieId integer NOT NULL,
            studioId integer NOT NULL,
            PRIMARY KEY(movieId, studioId)
        );`),
    ])
    await db.run(
      `CREATE UNIQUE INDEX producers_name_unique ON producers (name);`
    )
    await db.run(`CREATE UNIQUE INDEX studios_name_unique ON studios (name);`)
    console.log('Database initialized successfully.')
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}
