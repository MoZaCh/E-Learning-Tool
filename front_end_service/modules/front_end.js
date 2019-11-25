
'use strict'

//const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
//const mime = require('mime-types')
//const sqlite = require('sqlite-async')
//const saltRounds = 10

module.exports = class FrontEnd {

	async convertToBase(user, pass) {
		let basicAuth = `${user}:${pass}`
		const authBase64 = Buffer.from(basicAuth).toString('base64')
		basicAuth= `Basic ${authBase64}`
		return basicAuth
	}

	async convertToString(userInfo) {
		const b64array = userInfo.split(' ')
		const utf8str = Buffer.from(b64array[1], 'base64').toString().split(':')
		return utf8str
	}

	async makeObj(obj) {
		const body = obj.id.split(':')
		const data = {}
		data.id = body[0]
		data.topic = body[1]
		return data
	}
}
