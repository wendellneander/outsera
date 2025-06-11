import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './src/database/drizzle',
  schema: './src/database/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: ':memory:',
  },
})
