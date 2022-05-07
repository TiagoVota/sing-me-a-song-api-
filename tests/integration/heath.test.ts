import supertest from 'supertest'

import '../../src/setup.js'

import app from '../../src/app.js'


describe('GET /heath', () => {
	it('should return 200 for server alive', async () => {
		const response = await supertest(app).get('/health')
		const { status } = response

		expect(status).toEqual(200)
	})
})
