import supertest from 'supertest'

import '../../src/setup.js'

import app from '../../src/app.js'
import prisma from '../../src/database/database.js'

import {
	createRecommendation,
	findRecommendationByName,
	validBodyFactory,
} from '../factories/recommendationsFactory.js'


describe('POST /recommendations', () => {
	beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations;`
	})

	it('should return 422 for invalid body', async () => {
		const invalidBody = validBodyFactory()
		delete invalidBody.name
		delete invalidBody.score

		const response = await supertest(app)
			.post('/recommendations')
			.send(invalidBody)
		const { status } = response

		expect(status).toEqual(422)
	})

	it('should return 201 for valid body', async () => {
		const body = validBodyFactory()
		delete body.score

		const response = await supertest(app)
			.post('/recommendations')
			.send(body)
		const { status } = response

		const recommendation = findRecommendationByName(body.name)

		expect(status).toEqual(201)
		expect(recommendation).not.toBeNull()
	})

	it('should return 409 for conflict body', async () => {
		const body = validBodyFactory()
		delete body.score

		await createRecommendation(body)

		const response = await supertest(app)
			.post('/recommendations')
			.send(body)
		const { status } = response

		expect(status).toEqual(409)
	})
})


afterAll(async () => {
	await prisma.$disconnect()
})
