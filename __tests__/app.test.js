const request = require('supertest');
const app = require('../app');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const pool = require('../db/connection.js');
const { response } = require('../app');
const articles = require('../db/data/development-data/articles');
const jSorted = require('jest-sorted');

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
describe.only('GET /api/articles', () => {
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
						comment_count: expect.any(Number),
					}))
			})
			})
	})
	test('Should return a list of articles in order of creation date', () => {
		return request(app).get('/api/articles')
			.expect(200)
			.then( (response) => {
				expect(response.body.articles).toBeSortedBy('created_at', { descending: true})
			})
	})
	it('Should be able to respond to a topic filter and only respond with topics that are the same as the query', () => {
	return request(app)
	.get('/api/articles?topic=mitch')
	.expect(200)
	})

	it('Should be able to filter by topics', () => {
	return request(app)
	.get('/api/articles?topic=cats')
	.expect(200)
	.then( (response) => {
		expect(response.body.articles).toBeInstanceOf(Array)
		expect(response.body.articles.length).toBe(1)
	})
	})
	it('Should be able to filter by topics in ascending order', () => {
	return request(app)
	.get('/api/articles?sort_by=author')
	.expect(200)
	.then( (response) => {
		console.log(response.body.articles)
		expect(response.body.articles).toBeInstanceOf(Array)
		expect(response.body.articles.length).toBe(12)
		expect(response.body.articles).toBeSortedBy('author', { descending: true})
	})
	})
	it('Should be able to filter by topics in ascending order', () => {
	return request(app)
	.get('/api/articles?sort_by=author&order=ASC')
	.expect(200)
	.then( (response) => {
		console.log(response.body.articles)
		expect(response.body.articles).toBeInstanceOf(Array)
		expect(response.body.articles.length).toBe(12)
		expect(response.body.articles).toBeSortedBy('author', { descending: false})
	})
	})
	it('Should be able deal with a malformed request', () => {
	return request(app)
	.get('/api/articles?sort_by=author&order=SELECT')
	.expect(400)
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
				expect(response.body.msg).toBe('No file found')
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

describe('GET /api/articles/:article_id/comments', () => {
	it('Should return an array containing the comments with the correct properties', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then( (response) => {
				expect(response.body.comments[1]).toEqual(expect.objectContaining({
        comment_id: expect.any(Number),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
      }))
			})
	})
	it('Should return the comments in the correct (newest first) order', () => {
		return request(app)
		.get('/api/articles/1/comments')
		.expect(200)
		.then( (response) => {
			expect(response.body.comments).toBeSortedBy('created_at', {descending: true})
		})
	})
	
	test('Should return a 404 when the ID is a valid ID but does not exist in the database', () => {
		return request(app)
		.get('/api/articles/3211/comments')
		.expect(404)
		.then( (response) => {
			expect(response.body.msg).toBe(`No file found`)
		})

	})

	test('Should return a 400 when the ID is unrealistic', () => {
		return request(app)
		.get('/api/articles/3342342432211/comments')
		.expect(400)
		.then( (response) => {
			expect(response.body.msg).toBe(`Invalid URL exceeds viable number of articles`)
		})

	})
	test('Should return a 400 when the ID is just plain malevonent', () => {
		return request(app)
		.get('/api/articles/SELECT*/comments')
		.expect(400)
		.then( (response) => {
			expect(response.body.msg).toBe(`Doesn't exist`)
		})

	})
	test('Should return a 400 when the ID is just plain malevonent', () => {
		return request(app)
		.get('/api/articles/4/comments')
		.expect(200)
		.then( (response) => {
			expect(response.body.comments.length).toBe(0)
		})

	})
})

