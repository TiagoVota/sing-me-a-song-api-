import prisma from '../database/database.js'


const findAll = async () => {
	const health = await prisma.health.findMany()

	return health
}


export const healthRepository = {
	findAll,
}
