import express, { Application, Request, Response, NextFunction } from 'express'
import { createProducersController } from './domain/producer/producers.controller'
import { Logger } from './utils/logger'

class App {
  private app: Application
  private logger: Logger

  constructor() {
    this.app = express()
    this.logger = new Logger('App')
    this.initializeMiddlewares()
    this.registerRoutes()
    this.initializeErrorHandling()
  }

  private requestLogger = (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    this.logger.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next()
  }

  private errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    this.logger.error('Unhandled error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }

  private initializeMiddlewares() {
    this.app.use(express.json())
    this.app.use(this.requestLogger)
  }

  private registerRoutes() {
    const producersController = createProducersController()
    this.app.get(
      '/api/producers/min-max-intervals',
      producersController.getProducersWithMinAndMaxIntervals.bind(
        producersController
      )
    )
    this.app.get('/', (_req, res) => res.send('Hi!'))
  }

  private initializeErrorHandling() {
    this.app.use(this.errorHandler)
  }

  public getApp(): Application {
    return this.app
  }
}

export async function createApp(): Promise<Application> {
  const appInstance = new App()
  return appInstance.getApp()
}
