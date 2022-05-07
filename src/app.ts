import cors from 'cors'
import express from 'express'
import 'express-async-errors'

import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js'

import recommendationRouter from './routers/recommendationRouter.js'
import healthRouter from './routers/healthRouter.js'


const app = express()

app.use(cors())
app.use(express.json())

app.use('/recommendations', recommendationRouter)
app.use('/health', healthRouter)

app.use(errorHandlerMiddleware)


export default app
