const request = require('supertest');
const app = require('../app');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const pool = require('../db/connection.js');
const { response } = require('../app');


afterAll(() => pool.end());
beforeEach(() => seed(testData));


describe('GET /api/topics', () => {
	test('Should return a list of topics in the form of an array', () => {
		return request(app).get('/api/topics')
			.expect(200)
			.then( (response) => {
				expect(response.body.topics.length).toBe(3)
				response.body.topics.forEach( (topic) => {
					expect(topic).toEqual(expect.objectContaining({
						slug: expect.any(String),
						description: expect.any(String),
					}))
			})	
			})
	})
})
describe('GET /api/articles', () => {
	test('Should return a list of articles', () => {
		return request(app).get('/api/articles')
			.expect(200)
			.then( (response) => {
				expect(response.body.articles.length).toBe(12)	
				response.body.articles.forEach( (article) => {
					expect(article).toEqual(expect.objectContaining({
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number), 
						comment_count: expect.any(String),
					}))
			})
			})
	})
})
