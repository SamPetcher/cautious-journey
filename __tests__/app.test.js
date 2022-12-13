const request = require('supertest');
const app = require('../app');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const pool = require('../db/connection.js');


afterAll(() => pool.end());
beforeEach(() => seed(testData));


describe('GET /api/topics', () => {
	test('Should return a list of topics in the form of an array', () => {
		return request(app).get('/api/topics')
			.expect(200)
			.then( (r) => {
				expect(Array.isArray(r.body)).toBe(true)
				expect(r.body[0]).toEqual({slug: 'mitch', description: 'The man, the Mitch, the legend'})
			})
			})
	})

