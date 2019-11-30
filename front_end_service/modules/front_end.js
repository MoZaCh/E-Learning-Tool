
'use strict'

module.exports = class FrontEnd {

	/**
	 * Function which takes two string parameters and encodes string into base64
	 * @param {string} user - Contains the user's username as a string
	 * @param {string} pass - Contains the user's password as string
	 * @returns {string} - Returns the base64 of username and password + basic
	 */
	async convertToBase(user, pass) {
		let basicAuth = `${user}:${pass}`
		const authBase64 = Buffer.from(basicAuth).toString('base64')
		basicAuth= `Basic ${authBase64}`
		return basicAuth
	}

	/**
	 * Function which takes a base64 parameter and decodes it to string
	 * @param {*} userInfo - Contains base64
	 * @returns {string} - Returns a string
	 */
	async convertToString(userInfo) {
		const b64array = userInfo.split(' ')
		const utf8str = Buffer.from(b64array[1], 'base64').toString().split(':')
		return utf8str
	}

	/**
	 * Function which takes an object with a key which has mulitple values and separates each value
	 * @param {Object} obj - Contains an object which consists of one key with mulitple values
	 */
	async makeObj(obj) {
		const body = obj.id.split(':')
		const data = {}
		data.id = body[0]
		data.topic = body[1]
		return data
	}
}
