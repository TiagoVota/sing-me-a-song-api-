import { jest } from '@jest/globals'

import '../../src/setup.js'

import { recommendationService } from '../../src/services/recommendationsService.js'

import { recommendationRepository } from '../../src/repositories/recommendationRepository.js'

import {
	generateRecommendationId,
	validBodyFactory
} from '../factories/recommendationsFactory.js'

import { conflictError } from '../../src/utils/errorUtils.js'


const sut = recommendationService

describe('Recommendations Service - insert', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})

	it('should return conflict error for existent recommendation', async () => {
		const validBody = validBodyFactory()
		const recommendation = { ...validBody, id: generateRecommendationId() }

		jest.spyOn(recommendationRepository, 'findByName')
			.mockResolvedValueOnce(recommendation)
		
		const result = sut.insert(validBody)
		await expect(result).rejects.toEqual(conflictError('Recommendations names must be unique'))
	})

	it('should resolve function', async () => {
		const validBody = validBodyFactory()

		jest.spyOn(recommendationRepository, 'findByName')
			.mockResolvedValueOnce(null)
		jest.spyOn(recommendationRepository, 'create')
			.mockResolvedValueOnce()
		
		const result = sut.insert(validBody)
		await expect(result).resolves.toBeUndefined()
	})
})
