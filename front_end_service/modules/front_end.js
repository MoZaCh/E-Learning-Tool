
'use strict'

const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
//const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class frontEnd {

	async convertToBase(user, pass) {
		const basicAuth = `Basic ${user}:${pass}`
		const authBase64 = Buffer.from(basicAuth).toString('base64')
		return authBase64
	}
}
