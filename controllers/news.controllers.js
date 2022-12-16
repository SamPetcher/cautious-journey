const { selectTopics, selectArticles, selectArticle, selectArticleCommentsById } = require("../models/news.models")

exports.getTopics = (req, res, next) => selectTopics().then((topics) => {
        res.status(200).send({ topics })
    }).catch(next)

exports.getArticles = (req, res, next) => {
	const { topic, sort_by, order } = req.query
	
	selectArticles(topic, sort_by, order)
	.then( (articles) => {
	console.log(req.query)
	res.status(200).send({ articles })
}).catch(next)
}
exports.getArticle = (req, res, next) => {
	selectArticle(req.params.article_id)
	.then( (resArticle) => {res.status(200).send(resArticle)}).catch(next)
}
exports.getArticleCommentsById = ( req, res, next ) => {
	const pArticle = selectArticle(req.params.article_id)
	const pComments = selectArticleCommentsById(req.params.article_id)
	Promise.all([pArticle, pComments])
	.then( ([articles, comments]) => {
		
		res.status(200).send({ comments })
	}).catch(next)
}
