
exports.handleErrors = (err, req, res, next) => {
if (err.code === '22P02') {
	console.log(err)
	res.status(400).send({msg: "Doesn't exist"})
}
	else if (err.status === 404) {
		res.status(404).send({ msg: "No file found" })
	} 
	else if (err.code === '22003') {
		res.status(400).send({ msg:  "Invalid request. Cannot respond to this request please try again." })
	}

	else if (err.code === '23503') {
		res.status(404).send({ msg:  "Invalid selection please try again." })
	} 
	else {
		console.log(err)
		next(err);}
}
