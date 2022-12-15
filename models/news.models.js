const db = require('../db/connection.js')


exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then( (dbResponse) => dbResponse.rows )
}
exports.selectArticles = () => {
	return db.query('SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes ORDER BY articles.created_at DESC;')
	.then((response) => {
		return response.rows
	})
}
