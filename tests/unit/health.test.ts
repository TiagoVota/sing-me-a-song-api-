import { jest } from '@jest/globals'

import '../../src/setup.js'

import { healthService } from '../../src/services/healthService.js'

import { healthRepository } from '../../src/repositories/healthRepository.js'

import { badRequestError } from '../../src/utils/errorUtils.js'


const sut = healthService

describe('getHealthOrFail', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})
	
	it('should pass test', async () => {
		jest.spyOn(healthRepository, 'findAll')
			.mockResolvedValueOnce([])
		
		const result = await sut.getHealthOrFail()
		expect(result).not.toBeNull()
	})

	it('should return not found error for invalid return', async () => {
		jest.spyOn(healthRepository, 'findAll')
			.mockResolvedValueOnce(null)
		
		const result = sut.getHealthOrFail()
		await expect(result).rejects.toEqual(badRequestError('I\'m not alive :('))
	})
})


describe('getHealth', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})
	
	it('should pass test', async () => {
		jest.spyOn(sut, 'getHealthOrFail')
			.mockResolvedValueOnce()
		
		const result = await sut.getHealthOrFail()
		expect(result).not.toBeNull()
	})

	it('should return 404 for invalid return', async () => {
		jest.spyOn(sut, 'getHealthOrFail')
			.mockRejectedValueOnce(badRequestError('I\'m not alive :('))
		
		const result = sut.getHealthOrFail()
		await expect(result).rejects.toEqual(badRequestError('I\'m not alive :('))
	})
})
