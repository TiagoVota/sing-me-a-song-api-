import supertest from 'supertest'

import '../../src/setup.js'

import app from '../../src/app.js'
import prisma from '../../src/database/database.js'

import {
	createRecommendationList,
	findFistRecommendation,
	generateRandomAmount,
	generateRecommendationId,
} from '../factories/recommendationsFactory.js'


describe('GET /recommendations', () => {
	beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations;`

		await createRecommendationList()
	})

	it('should return 200 with 10 or less recommendations', async () => {
		const response = await supertest(app)
			.get('/recommendations')
		const { status, body: recommendations } = response

		expect(status).toEqual(200)
		expect(recommendations.length).toBeLessThanOrEqual(10)
	})
})


describe('GET /recommendations/:id', () => {
	beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations;`

		await createRecommendationList()
	})

	it('should return 200 with a recommendation', async () => {
		const recommendation = await findFistRecommendation()
		const recommendationId = recommendation.id

		const response = await supertest(app)
			.get(`/recommendations/${recommendationId}`)
		const { status, body: findRecommendation } = response

		expect(status).toEqual(200)
		expect(findRecommendation).not.toBeNull()
	})

	it('should return 404 for no found id', async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations;`

		const noFoundId = generateRecommendationId()

		const response = await supertest(app)
			.get(`/recommendations/${noFoundId}`)
		const { status } = response

		expect(status).toEqual(404)
	})
})


describe('GET /recommendations/random', () => {
	beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations;`

		await createRecommendationList()
	})

	it('should return 200 with a recommendation', async () => {
		const response = await supertest(app)
			.get('/recommendations/random')
		const { status, body: recommendation } = response

		expect(status).toEqual(200)
		expect(recommendation).not.toBeNull()
	})

	it('should return 404 for no found id', async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations;`

		const response = await supertest(app)
			.get('/recommendations/random')
		const { status } = response

		expect(status).toEqual(404)
	})
})


describe('GET /recommendations/top/:amount', () => {
	beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations;`

		await createRecommendationList()
	})

	it('should return 200 with top recommendations', async () => {
		const amount = generateRandomAmount()

		const response = await supertest(app)
			.get(`/recommendations/top/${amount}`)
		const { status, body: recommendations } = response
		const firstScore = recommendations[0].score
		const secondScore = recommendations[1].score

		expect(status).toEqual(200)
		expect(recommendations).not.toBeNull()
		expect(firstScore).toBeGreaterThanOrEqual(secondScore)
	})
})


afterAll(async () => {
	await prisma.$disconnect()
})
