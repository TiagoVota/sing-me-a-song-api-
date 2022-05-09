import { jest } from '@jest/globals'

import '../../src/setup.js'

import { recommendationService } from '../../src/services/recommendationsService.js'

import { recommendationRepository } from '../../src/repositories/recommendationRepository.js'

import {
	generateRandomAmount,
	generateRecommendationId,
	validBodyFactory
} from '../factories/recommendationsFactory.js'


const sut = recommendationService

describe('Recommendations Service - get', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})

	it('should return list of recommendations', async () => {
		const id = generateRecommendationId()
		const validBody = validBodyFactory()
		const recommendation = { ...validBody, id }

		jest.spyOn(recommendationRepository, 'findAll')
			.mockResolvedValueOnce([recommendation])
	
		const result = sut.get()
	
		await expect(result).resolves.not.toBeNull()
	})
})


describe('Recommendations Service - getTop', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})

	it('should return list of recommendations', async () => {
		const id = generateRecommendationId()
		const validBody = validBodyFactory()
		const recommendation = { ...validBody, id }
		const amount = generateRandomAmount()

		jest.spyOn(recommendationRepository, 'getAmountByScore')
			.mockResolvedValueOnce([recommendation])
	
		const result = sut.getTop(amount)
	
		await expect(result).resolves.not.toBeNull()
	})
})


describe('Recommendations Service - getRandom', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})

	it('should return a good random of recommendation', async () => {
		const id = generateRecommendationId()
		const validBody = validBodyFactory()
		const recommendation = { ...validBody, id, score: 100}

		jest.spyOn(Math, 'random')
			.mockImplementation(() => 0.8)
		jest.spyOn(recommendationRepository, 'findAll')
			.mockResolvedValueOnce([recommendation])
		jest.spyOn(sut, 'getByScore')
			.mockResolvedValueOnce([recommendation])
	
		const result = sut.getRandom()
	
		await expect(result).resolves.not.toBeNull()
	})

	it('should return a bad random of recommendation', async () => {
		const id = generateRecommendationId()
		const validBody = validBodyFactory()
		const recommendation = { ...validBody, id, score: -2}

		jest.spyOn(Math, 'random')
			.mockImplementation(() => 0.3)
		jest.spyOn(recommendationRepository, 'findAll')
			.mockResolvedValueOnce([recommendation])
		jest.spyOn(sut, 'getByScore')
			.mockResolvedValueOnce([recommendation])
	
		const result = sut.getRandom()
	
		await expect(result).resolves.not.toBeNull()
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
