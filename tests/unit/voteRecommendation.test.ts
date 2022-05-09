import { jest } from '@jest/globals'

import '../../src/setup.js'

import { recommendationService } from '../../src/services/recommendationsService.js'

import { recommendationRepository } from '../../src/repositories/recommendationRepository.js'

import {
	generateRecommendationId,
	validBodyFactory
} from '../factories/recommendationsFactory.js'

import { notFoundError } from '../../src/utils/errorUtils.js'


const sut = recommendationService

describe('Recommendations Service - upvote', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})

	it('should return not found error for inexistent id', async () => {
		const id = generateRecommendationId()

		jest.spyOn(sut, 'getById')
			.mockRejectedValueOnce(id)
		
		const result = sut.upvote(id)
		await expect(result).rejects.toEqual(notFoundError())
	})

	it('should update score', async () => {
		const id = generateRecommendationId()
		const validBody = validBodyFactory()
		const recommendation = { ...validBody, id }

		jest.spyOn(recommendationRepository, 'find')
			.mockResolvedValueOnce(recommendation)
		jest.spyOn(sut, 'getById')
			.mockResolvedValueOnce(recommendation)
		jest.spyOn(recommendationRepository, 'updateScore')
			.mockResolvedValueOnce(recommendation)
		
		const result = sut.upvote(id)

		await expect(result).resolves.toBeUndefined()
	})
})


describe('Recommendations Service - getByIdOrFail', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})

	it('should thrown not found error', async () => {
		const id = generateRecommendationId()

		jest.spyOn(recommendationRepository, 'find')
			.mockResolvedValueOnce(null)
		
		const result = sut.upvote(id)

		await expect(result).rejects.toEqual(notFoundError())
	})

	it('should return find recommendation', async () => {
		const id = generateRecommendationId()
		const validBody = validBodyFactory()
		const recommendation = { ...validBody, id }

		jest.spyOn(recommendationRepository, 'find')
			.mockResolvedValueOnce(recommendation)
		
		const result = sut.upvote(id)

		await expect(result).resolves.not.toBeNull()
	})
})


describe('Recommendations Service - downvote', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})

	it('should return not found error for inexistent id', async () => {
		const id = generateRecommendationId()

		jest.spyOn(sut, 'getById')
			.mockRejectedValueOnce(id)
		
		const result = sut.downvote(id)
		await expect(result).rejects.toEqual(notFoundError())
	})

	it('should update score > -5', async () => {
		const id = generateRecommendationId()
		const validBody = validBodyFactory()
		const recommendation = { ...validBody, id }

		jest.spyOn(recommendationRepository, 'find')
			.mockResolvedValueOnce(recommendation)
		jest.spyOn(sut, 'getById')
			.mockResolvedValueOnce(recommendation)
		jest.spyOn(recommendationRepository, 'updateScore')
			.mockResolvedValueOnce(recommendation)

		const result = sut.downvote(id)

		await expect(result).resolves.toBeUndefined()
	})

	it('should update score = -5', async () => {
		const id = generateRecommendationId()
		const validBody = validBodyFactory()
		const recommendation = { ...validBody, id, score: -5 }

		jest.spyOn(recommendationRepository, 'find')
			.mockResolvedValueOnce(recommendation)
		jest.spyOn(sut, 'getById')
			.mockResolvedValueOnce(recommendation)
		jest.spyOn(recommendationRepository, 'updateScore')
			.mockResolvedValueOnce(recommendation)

		const result = sut.downvote(id)

		await expect(result).resolves.toBeUndefined()
	})

	it('should update score < -5 and delete recommendation', async () => {
		const id = generateRecommendationId()
		const validBody = validBodyFactory()
		const recommendation = { ...validBody, id, score: -6 }

		jest.spyOn(recommendationRepository, 'find')
			.mockResolvedValueOnce(recommendation)
		jest.spyOn(sut, 'getById')
			.mockResolvedValueOnce(recommendation)
		jest.spyOn(recommendationRepository, 'updateScore')
			.mockResolvedValueOnce(recommendation)
		jest.spyOn(recommendationRepository, 'remove')
			.mockResolvedValueOnce()

		const result = sut.downvote(id)

		await expect(result).resolves.toBeUndefined()
	})
})


describe('Recommendations Service - getScoreFilter', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})

	it('should return gt for random < 0.7', () => {
		const result = sut.getScoreFilter(0.69)

		expect(result).toEqual('gt')
	})

	it('should return lte for random > 0.7', () => {
		const result = sut.getScoreFilter(0.71)

		expect(result).toEqual('lte')
	})

	it('should return lte for random = 0.7', () => {
		const result = sut.getScoreFilter(0.7)

		expect(result).toEqual('lte')
	})
})
