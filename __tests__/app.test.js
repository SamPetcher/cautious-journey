const request = require('supertest');
const app = require('../app');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const pool = require('../db/connection.js');
const { response } = require('../app');


afterAll(() => pool.end());
beforeEach(() => seed(testData));


describe.only('GET /api/topics', () => {
	test('Should return a list of topics in the form of an array', () => {
		return request(app).get('/api/topics')
			.expect(200)
			.then( (topics) => {
				expect(topics.body.length).toBe(3)
				topics.body.forEach( (topics) => {
					expect(topics).toEqual(expect.objectContaining({
						slug: expect.any(String),
						description: expect.any(String),
					}))
			})	
			})
	})
})
