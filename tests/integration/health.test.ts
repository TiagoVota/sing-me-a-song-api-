import supertest from 'supertest'

import '../../src/setup.js'

import app from '../../src/app.js'
import prisma from '../../src/database/database.js'


describe('GET /health', () => {
	it('should verify if tests are alive', () => {
		expect(1).toEqual(1)
	})

	it('should return 200 for server alive', async () => {
		const response = await supertest(app).get('/health')
		const { status, body } = response

		expect(status).toEqual(200)
		expect(body).not.toBeNull()
	})
})


afterAll(async () => {
	await prisma.$disconnect()
})
