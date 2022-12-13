const db = require('../db/connection.js')


exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then( (dbResponse) => dbResponse.rows )
}

exports.getArticles = () => {
	return db.query('SELECT * FROM articles;').then( (dbResponse) => dbResponse.rows)
}
