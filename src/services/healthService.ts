import * as healthRepository from '../repositories/healthRepository.js'

import { badRequestError } from '../utils/errorUtils.js'


const getHealth = async () => {
	await getHealthOrFail()

	const successMsg = 'I\'m alive!'

	return successMsg
}


const getHealthOrFail = async () => {
	const health = await healthRepository.findAll()
	if (!health) throw badRequestError('I\'m not alive :(')
}


export {
	getHealth,
}
