const { selectTopics } = require("../models/news.models")

exports.getTopics = (req, res, next) => selectTopics().then((topics) => {
        return res.status(200).send({topics})
    }).catch((err) => {
        next(err)
    })
