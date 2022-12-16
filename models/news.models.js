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
exports.selectArticle = (article_id) => {
	return db.query('SELECT * FROM articles WHERE article_id = $1',[article_id]).then( (response) => {
		const articles = response.rows[0]
		if(!articles){
			return Promise.reject({status: 404, msg: "No file found",});
		}
		return response.rows[0];
		})
}
exports.selectArticleCommentsById = (article_id) => {
	return db.query('SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [article_id])
	.then( (comments) => {
		return comments.rows
	})
}

exports.updateArticleVotes = (article_id, body) => {
	const values = [article_id, body]
	const pSelectArticle = this.selectArticle(article_id)
	const updatedArticle = db.query('UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;', values)
	return Promise.all([updatedArticle, pSelectArticle])
	.then( (updatedArticle) => {
		return  updatedArticle[0].rows[0];
	})
}



