import { Request, Response } from 'express'

import * as healthService from '../services/healthService.js'


async function checkHealth(req: Request, res: Response) {
	const health = await healthService.getHealth()

	res.send(health).status(200)
}


export {
	checkHealth,
}
