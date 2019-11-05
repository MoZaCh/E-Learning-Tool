
'use strict'

const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,
				user TEXT, pass TEXT, firstName TEXT, surname TEXT);`
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * Checks that username, password, firstname and surname are not blank
	 * @param {Object} regObj - The object contains username, password, firstname and surname of a specific user
	 * @throws {Error} - Throws error message "Missubg <parameter>" depending on is left blank
	 */
	async checkCredentials(regObj) {
		for (const each in regObj) {
			if (regObj[each] === '' | typeof regObj[each] === 'undefined') throw new Error(`Missing ${each}`)
		}
	}

	/**
	 * Takes user, pass, firstName and surname and then registers user by storing it into the database
	 * @param {string} user - The username of a specific user as a string
	 * @param {string} pass - The password of a specific user as a string
	 * @param {string} firstName - The firstname of a specific user as a string
	 * @param {string} surname - The surname of a specific user as a string
	 * @throws {Error} - Throws error message "username <user> already in use" if username is already in use
	 * @returns {boolean} - Returns true once user has successfully been created
	 */
	async register(user, pass, firstName, surname) {
		try {
			const regObj = {
				Username: user,
				Password: pass,
				FirstName: firstName,
				Surname: surname}
			await this.checkCredentials(regObj)
			let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
			const data = await this.db.get(sql)
			if(data.records !== 0) throw new Error(`username "${user}" already in use`)
			pass = await bcrypt.hash(pass, saltRounds)
			sql = `INSERT INTO users(user, pass, firstName, surname) 
			VALUES("${user}", "${pass}", "${firstName}", "${surname}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	async uploadPicture(path, mimeType) {
		const extension = mime.extension(mimeType)
		console.log(`path: ${path}`)
		console.log(`extension: ${extension}`)
		//await fs.copy(path, `public/avatars/${username}.${fileExtension}`)
	}

	async login(username, password) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`username "${username}" not found`)
			sql = `SELECT pass FROM users WHERE user = "${username}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(password, record.pass)
			if(valid === false) throw new Error(`invalid password for account "${username}"`)
			return true
		} catch(err) {
			throw err
		}
	}

	async userDetails(username) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`"${username}" does not exist`)
			sql = `SELECT * FROM users WHERE user ="${username}";`
			const record = await this.db.get(sql)
			return record
			// if(record === false) throw new Error(`"${username}" does not exist!`)
			// return true
		} catch(err) {
			throw err
		}
	}

	async updateDetails(username, firstName, surname) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`"${username}" does not exist`)

			sql = `UPDATE users SET firstName = "${firstName}", surname = "${surname}" WHERE user="${username}";`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}
}
