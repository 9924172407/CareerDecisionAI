
const database = require('./database')
const passport = require('./passport')

const config = {
	server: {
		port: process.env.PORT || 6000,
	},
	jwtConfig: {
		secret: process.env.JWT_SECRET,
		expiry: process.env.JWT_EXPIRY,
	},
	passport,
	db: {
		connection: database,
	},
}

module.exports = config
