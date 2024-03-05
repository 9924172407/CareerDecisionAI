class ExpressError extends Error {
	constructor(message, _statusCode = 500) {
		super(message)
		this.statusCode = _statusCode
	}
}

module.exports = ExpressError
