const db = require('../db/connection.js')


exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then( (dbResponse) => dbResponse.rows )
}
exports.selectArticles = (topic, sort_by = 'created_at', order = 'DESC') => {
	const qVals = [topic, sort_by, order]
	const allowedTopics = ['owner','title','category','designer','created_at']
	const allowedSort = ['ASC','DESC']
	let queryFrag1 = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id` 	
	const queryFrag2 = `GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes	ORDER BY`	
 	if (topic) queryFrag1 += ` WHERE topic = '${topic}'`
	const finalQuery = queryFrag1 + ' ' + queryFrag2 + ' ' + sort_by + ' ' + order + ';'
	return db.query(finalQuery)
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
	const pUpdate = db.query('UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;', values)
	return Promise.all([pSelectArticle, pUpdate])
	.then( ([article, update]) => {
		return update.rows[0];
	})
}

exports.selectUsers =() => {
    return db.query('SELECT * FROM users;').then( (dbResponse) => dbResponse.rows )
}


