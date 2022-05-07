import { Router } from 'express'
import * as healthController from '../controllers/healthController.js'


const healthRouter = Router()

healthRouter.get('', healthController.checkHealth)


export default healthRouter
