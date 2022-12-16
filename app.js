const express = require('express');
<<<<<<< HEAD
const { getTopics, getArticles, getUsers, getArticle, getArticleCommentsById, patchArticleVotes  } = require('./controllers/news.controllers');
=======
const { getTopics, getArticles, getArticle, getArticleCommentsById, postArticleCommentById } = require('./controllers/news.controllers');
>>>>>>> main

const { handleErrors } = require('./controllers/errors.controllers.js')
const app = express();
<<<<<<< HEAD

app.use(express.json());
=======
app.use(express.json())
>>>>>>> main
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticle)
app.get('/api/articles/:article_id/comments', getArticleCommentsById)
<<<<<<< HEAD
app.get('/api/users', getUsers)
app.patch('/api/articles/:article_id', patchArticleVotes);
//app.use((err, req, res, next) => {
//  if (err.status && err.msg) res.status(err.status).send({msg: err.msg})
//	else if (err = '22P02') res.status(400).send({ msg: "Doesn't exist"})
//	else res.status(500).send('Server Error!');
//});
=======
app.post('/api/articles/:article_id/comments', postArticleCommentById)
>>>>>>> main

app.use(handleErrors)


module.exports = app
