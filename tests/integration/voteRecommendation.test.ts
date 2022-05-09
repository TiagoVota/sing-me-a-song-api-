import supertest from 'supertest'

import '../../src/setup.js'

import app from '../../src/app.js'
import prisma from '../../src/database/database.js'

import {
	createRecommendation,
	findRecommendationByName,
	generateRecommendationId,
} from '../factories/recommendationsFactory.js'


describe('POST /recommendations/:id/upvote', () => {
	beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations;`
	})

	it('should return 404 for not found id', async () => {
		const invalidRecommendationId = generateRecommendationId()

		const response = await supertest(app)
			.post(`/recommendations/${invalidRecommendationId}/upvote`)
		const { status } = response

		expect(status).toEqual(404)
	})

	it('should return 200 for increment recommendation', async () => {
		const recommendation = await createRecommendation()
		const { id: validId, name, score } = recommendation

		const response = await supertest(app)
			.post(`/recommendations/${validId}/upvote`)
		const { status } = response

		const increasedRecommendation = await findRecommendationByName(name)
		const increasedScore = increasedRecommendation.score

		expect(status).toEqual(200)
		expect(increasedScore).toBeGreaterThan(score)
	})
})


describe('POST /recommendations/:id/downvote', () => {
	beforeEach(async () => {
		await prisma.$executeRaw`TRUNCATE TABLE recommendations;`
	})

	it('should return 404 for not found id', async () => {
		const invalidRecommendationId = generateRecommendationId()

		const response = await supertest(app)
			.post(`/recommendations/${invalidRecommendationId}/upvote`)
		const { status } = response

		expect(status).toEqual(404)
	})

	it('should return 200 for decrease recommendation', async () => {
		const recommendation = await createRecommendation()
		const { id: validId, name, score } = recommendation

		const response = await supertest(app)
			.post(`/recommendations/${validId}/downvote`)
		const { status } = response

		const decreasedRecommendation = await findRecommendationByName(name)
		const decreasedScore = decreasedRecommendation.score

		expect(status).toEqual(200)
		expect(decreasedScore).toBeLessThan(score)
	})

	it('should return 200 for decrease recommendation and delete score -5', async () => {
		const minScore = -5

		const recommendation = await createRecommendation({ score: minScore })
		const { id: validId, name } = recommendation

		const response = await supertest(app)
			.post(`/recommendations/${validId}/downvote`)
		const { status } = response

		const deletedRecommendation = await findRecommendationByName(name)

		expect(status).toEqual(200)
		expect(deletedRecommendation).toBeNull()
	})
})


afterAll(async () => {
	await prisma.$disconnect()
})
