const express = require('express');
const { getTopics, getArticles, getArticle, getArticleCommentsById } = require('./controllers/news.controllers');

const { handleErrors } = require('./controllers/errors.controllers.js')

const app = express();

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticle)
app.get('/api/articles/:article_id/comments', getArticleCommentsById)
//app.use((err, req, res, next) => {
//  if (err.status && err.msg) res.status(err.status).send({msg: err.msg})
//	else if (err = '22P02') res.status(400).send({ msg: "Doesn't exist"})
//	else res.status(500).send('Server Error!');
//});

// Improved Error Handling
app.use(handleErrors)

module.exports = app
