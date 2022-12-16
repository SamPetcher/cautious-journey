const express = require('express');
const { getTopics, getArticles, getArticle, getArticleCommentsById, postArticleCommentById } = require('./controllers/news.controllers');

const { handleErrors } = require('./controllers/errors.controllers.js')

const app = express();
app.use(express.json())
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticle)
app.get('/api/articles/:article_id/comments', getArticleCommentsById)
app.post('/api/articles/:article_id/comments', postArticleCommentById)

app.use(handleErrors)


module.exports = app
