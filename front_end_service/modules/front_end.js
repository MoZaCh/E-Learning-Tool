
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

		//const basicAuth = `Basic ${user}:${pass}`
		//const authBase64 = Buffer.from(basicAuth).toString('base64')
	}

	async convertToString(userInfo) {
		const b64array = userInfo.split(' ')
		const utf8str = Buffer.from(b64array[1], 'base64').toString().split(':')

		// const b64array = Buffer.from(userInfo, 'base64').toString().split(' ')
		// console.log(b64array, '<<<<<<<<<<<<<<')
		// const userPass = b64array[1].split(':')
		return utf8str
	}

	async decodeUri(message) {
		const messageDecode = decodeURI(message)
		return messageDecode
	}
}
