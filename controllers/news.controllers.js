const { selectTopics, selectArticles, selectArticle } = require("../models/news.models")

exports.getTopics = (req, res, next) => selectTopics().then((topics) => {
        res.status(200).send({ topics })
    }).catch((err) => {
        next(err)
    })

exports.getArticles = (req, res, next) => selectArticles().then( (articles) => {
	res.status(200).send({ articles })
}).catch( (err) => next(err))

exports.getArticle = (req, res, next) => {
	selectArticle(req.params.article_id)
	.then( (resArticle) => {res.status(200).send(resArticle)}).catch((err) => next(err))
}
