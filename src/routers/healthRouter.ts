import { Router } from 'express'


const healthRouter = Router()

healthRouter.get('', (_, res) => res.status(200).send('I\'m alive!'))


export default healthRouter
