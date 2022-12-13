const express = require('express');
const { getTopics, getArticles } = require('./controllers/news.controllers');
const app = express();

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Server Error!');
});

module.exports = app
