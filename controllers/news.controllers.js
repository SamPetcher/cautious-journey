const { selectTopics, selectArticles, selectArticle, selectArticleCommentsById } = require("../models/news.models")

exports.getTopics = (req, res, next) => selectTopics().then((topics) => {
        res.status(200).send({ topics })
    }).catch(next)

exports.getArticles = (req, res, next) => selectArticles().then( (articles) => {
	res.status(200).send({ articles })
}).catch(next)

exports.getArticle = (req, res, next) => {
	selectArticle(req.params.article_id)
	.then( (resArticle) => {res.status(200).send(resArticle)}).catch(next)
}
exports.getArticleCommentsById = ( req, res, next ) => {
	selectArticleCommentsById(req.params.article_id)
	.then( (comments) => {res.status(200).send(comments)}).catch(next)
}
