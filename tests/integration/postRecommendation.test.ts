import supertest from 'supertest'

import '../../src/setup.js'

import app from '../../src/app.js'
import prisma from '../../src/database/database.js'

import {
	createRecommendation,
	findRecommendationById,
} from '../factories/recommendationsFactory.js'


describe('POST /recommendations', () => {
	beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations;`
	})

	it('should return 422 for invalid body', async () => {
		const invalidBody = {
			youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y'
		}

		const response = await supertest(app)
			.post('/recommendations')
			.send(invalidBody)
		const { status } = response

		expect(status).toEqual(422)
	})

	it('should return 201 for valid body', async () => {
		const body = {
			name: 'Falamansa - Xote dos Milagres',
			youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y'
		}

		const response = await supertest(app)
			.post('/recommendations')
			.send(body)
		const { status } = response

		const recommendation = findRecommendationById(body.name)

		expect(status).toEqual(201)
		expect(recommendation).not.toBeNull()
	})

	it('should return 409 for conflict body', async () => {
		const body = {
			name: 'Falamansa - Xote dos Milagres',
			youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y'
		}

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
