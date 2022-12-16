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
			expect(response.body.msg).toBe(`Invalid request. Cannot respond to this request please try again.`)
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
describe('PATCH /api/articles/:article_id', () => {
	it('Should be able to PATCH an article to change the value of its votes and respond with that article and the way it looks after', () => {
		const patchObj = { inc_votes: 3}
		return request(app)
		.patch('/api/articles/1')
		.send(patchObj)
		.expect(200)
		.then( (response) => {
			expect(response.body.votes).toBe(103)
		})
	})
	it('Should not allow the user to increment the votes of an article that isnt there', () => {
		const patchObj = { inc_votes: 3}
		return request(app)
		.patch('/api/articles/4444333')
		.send(patchObj)
		.expect(404)
		})
	it('Should not allow the user to increment the votes of an article that isnt there (sad path edition)', () => {
		const patchObj = { inc_votes: 3}
		return request(app)
		.patch('/api/articles/SELECT*FROM')
		.send(patchObj)
		.expect(400)
		})
	it('Should not allow the user to increment the votes if the votes are the wrong type of data', () => {
		const patchObj = { inc_votes: 'chickens'}
		return request(app)
		.patch('/api/articles/1')
		.send(patchObj)
		.expect(400)
		})
	it('Shouldn\'t allow the user to patch a malformed object', () => {
		const patchObj = { inc_votes: 'SELECT * FROM'}
		return request(app)
		.patch('/api/articles/1')
		.send(patchObj)
		.expect(400)
		})
})

describe('GET /api/users', () => {
	it('Should respond to end point with an array of user objects', () => {
		return request(app)
		.get('/api/users')
		.expect(200)
		.then( (response) => {
			expect(response.body.length).toBe(4)
			expect(response.body).toBeInstanceOf(Array)
			response.body.forEach( (user) => {
				expect(user).toEqual( expect.objectContaining({
					username: expect.any(String),
					name: expect.any(String),
					avatar_url: expect.any(String),
				}))
			})
		})

describe('POST /api/articles/:article_id/comments', () => {
	// This end-point will take an object with the username and body props and insert in to the database. It should respond with the posted comment...
	it('Should successfully post a comment and return it to the user', () => {
	const commentPost = {username: 'butter_bridge', body: 'the vomit was white with black spots and a lady on our street owns a dalmation',}
		return request(app)
		.post('/api/articles/1/comments')
		.send(commentPost)
		.expect(201)
		.then( (comment) => {
				expect(comment.body.comment).toEqual(expect.objectContaining({
        comment_id: expect.any(Number),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
      }))

		})
	})
	it('Should return an error when trying to post to a non existent article', () => {
	const commentPost = {username: 'butter_bridge', body: 'the vomit was white with black spots and a lady on our street owns a dalmation',}
		return request(app)
		.post('/api/articles/44433/comments')
		.send(commentPost)
		.expect(404)
		.then( (comment) => {
			expect(comment.body.msg).toEqual("Invalid selection please try again.")
		})
	})
	it('Should return an error when trying to post to a non-existant sad path article', () => {
	const commentPost = {username: 'butter_bridge', body: 'the vomit was white with black spots and a lady on our street owns a dalmation',}
		return request(app)
		.post('/api/articles/sausages/comments')
		.send(commentPost)
		.expect(400)
		.then( (comment) => {
			expect(comment.body.msg).toEqual("Doesn't exist")
		})
	})
	it('Should return an error when trying to post a non existent user', () => {
	const commentPost = {username: 'Ken M', body: 'the vomit was white with black spots and a lady on our street owns a dalmation',}
		return request(app)
		.post('/api/articles/1/comments')
		.send(commentPost)
		.expect(404)
		.then( (comment) => {
			expect(comment.body.msg).toEqual("Invalid selection please try again.")
		})
	})

	it('Should successfully post a comment and return it to the user even if they include extra props...', () => {
	const commentPost = {username: 'butter_bridge', body: 'the vomit was white with black spots and a lady on our street owns a dalmation', request: 'Eat my shorts',}
		return request(app)
		.post('/api/articles/1/comments')
		.send(commentPost)
		.expect(201)
		.then( (comment) => {
				expect(comment.body.comment).toEqual(expect.objectContaining({
        comment_id: expect.any(Number),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
      }))

		})
})
	it('Should 400 when the user doesnt provide the correct field...', () => {
	const commentPost = {username: 'butter_bridge', }
		return request(app)
		.post('/api/articles/sausages/comments')
		.send(commentPost)
		.expect(400)
		.then( (comment) => {
			expect(comment.body.msg).toEqual("Doesn't exist")
		})
	})
})

	})
})
