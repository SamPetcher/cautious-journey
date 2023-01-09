const cors = require("cors")
const express = require('express');
const { getTopics, getArticles, getUsers, getArticle, getArticleCommentsById, patchArticleVotes, postArticleCommentById } = require('./controllers/news.controllers');

const { handleErrors } = require('./controllers/errors.controllers.js')
const app = express();
app.use(cors());
app.use(express.json())
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticle)
app.get('/api/articles/:article_id/comments', getArticleCommentsById)
app.get('/api/users', getUsers)
app.patch('/api/articles/:article_id', patchArticleVotes);
app.post('/api/articles/:article_id/comments', postArticleCommentById)


app.use(handleErrors)


module.exports = app
