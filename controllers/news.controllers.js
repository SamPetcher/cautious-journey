const { selectTopics } = require("../models/news.models")

exports.getTopics = (req, res, next) => selectTopics().then((r) => {
        return res.status(200).send(r)
    }).catch((err) => {
        next(err)
    })

