const db = require('../db/connection.js')


exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then( (dbResponse) => dbResponse.rows )
}
exports.selectArticles = () => {
	return db.query('SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes ORDER BY articles.created_at DESC;')
	.then((response) => {
		return response.rows
	})
}
exports.selectArticle = (article_id) => {
	return db.query('SELECT * FROM articles WHERE article_id = $1',[article_id]).then( (response) => {
		if(response.rows.length === 0){
			return Promise.reject({status: 404, msg: "No user found",})
		}
		return response.rows[0]
		})
}
exports.selectArticleCommentsById = (article_id) => {
	return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [article_id])
	.then( (comments) => {
		return comments.rows
		
	})
}
