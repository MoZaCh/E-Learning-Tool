
'use strict'

const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
//const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class frontEnd {

	async convertToBase(user, pass) {
		const basicAuth = `basic= ${user}:${pass}`
		console.log(basicAuth)
		const authBase64 = basicAuth.toString('base64')
		console.log(authBase64)

	}
}
