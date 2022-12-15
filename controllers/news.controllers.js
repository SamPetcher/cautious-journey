const { selectTopics, selectArticles, selectArticle, selectArticleCommentsById, updateArticleVotes } = require("../models/news.models")

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
	const pArticle = selectArticle(req.params.article_id)
	const pComments = selectArticleCommentsById(req.params.article_id)
	Promise.all([pArticle, pComments])
	.then( ([articles, comments]) => {
		
		res.status(200).send({ comments })
	}).catch(next)
}
exports.patchArticleVotes = ( req, res, next ) => {
	updateArticleVotes(req.params.article_id, req.body.inc_votes)
	.then( (dbResponse) => {
		res.status(200).send(dbResponse)
	}).catch(next)
}
