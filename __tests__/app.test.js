const request = require('supertest');
const app = require('../app');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const pool = require('../db/connection.js');
const { response } = require('../app');
const articles = require('../db/data/development-data/articles');


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

describe('GET /api/articles/:article_id', () => {
	it('Should return a specific article in response to a GET request at the parametric endpoint', () => {
		return request(app)
			.get('/api/articles/1')
			.expect(200)
			.then( (response) => {
				expect(response.body).toEqual({
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_id: 1
      })
			})
	})
	it('Should be able to status 404 when a valid request is put through that is not available', () => {
		return request(app)
			.get('/api/articles/2222')
			.expect(404)
			.then( (response) => {
				expect(response.body.msg).toBe('No user found')
			})
	})
		
	it('Should be able to status 400 when a invalid request is put through',  () => {
		return request(app)
			.get('/api/articles/rawr')
			.expect(400)
			.then( (response) => {
				expect(response.body.msg).toBe(`Doesn't exist`)
			})
	})
})

describe.only('GET /api/articles/:article_id/comments', () => {
	it('Should return an array containing the comments with the correct properties', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then( (response) => {
				console.log(response.body, "test response")
				expect(response.body).toBeInstanceOf(Array)
			})
	})
})
