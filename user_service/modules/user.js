
'use strict'

const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
//const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,
				user TEXT, pass TEXT, firstName TEXT, surname TEXT, type TEXT);`
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * Checks that username, password, firstname and surname are not blank
	 * @param {Object} regObj - The object contains username, password, firstname and surname of a specific user
	 * @throws {Error} - Throws error message "Missing <parameter>" depending on which is left blank
	 */
	async checkCredentials(regObj) {
		if (Object.getOwnPropertyNames(regObj).length === 0) throw new Error('Empty Object')
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
			sql = `INSERT INTO users(user, pass, firstName, surname, type) 
			VALUES("${user}", "${pass}", "${firstName}", "${surname}", "user");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	/**
	 * Takes username and password and checks that both match a record in the database
	 * @param {string} username - The username of a specific username
	 * @param {string} password - The password associated a specific username
	 * @throws {Error} - Throws error message "username <username> not found" if username does not already exist
	 * @throws {Error} - Throws error message "invalid password for account <username>"
	 * @returns {boolean} - Returns true if username and password match a specific user record.
	 */
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

	/**
	 * Takes username as parameter and returns the user information if the user exists
	 * @param {string} username - Takes a string username
	 * @throws {Error} - "Username" does not exist, if the username does not match a record in the database
	 * @returns {Object} - Returns an object containing key-value pairs of user information
	 */
	async userDetails(username) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`"${username}" does not exist`)
			sql = `SELECT * FROM users WHERE user ="${username}";`
			const record = await this.db.get(sql)
			if(record.type === 'admin') record.isAdmin = true
			return record
		} catch(err) {
			throw err
		}
	}

	/**
	 * Takes parameters username, firstname and surname to update user details and returns true if successful
	 * @param {string} username - Username a string which is used to find the user in the database
	 * @param {string} firstName - Firstname a string which is used to update the user's first name
	 * @param {string} surname - Surname a string which is passed so that the user's surname can be updated
	 * @throws {Error} - "Username" does not exist, if the user does not exist in the database
	 */
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

	/**
	 * Function which takes a username and deletes that specific user
	 * @param {string} username - Takes parameter user string
	 * @throws {Error} - "Username" does not exist, if username does not exist
	 * @returns {boolean} - If username provided has been succesfully deleted
	 */
	async deleteUser(username) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`"${username}" does not exist`)
			sql = `DELETE FROM users WHERE user="${username}";`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

	/**
	 * Function which takes parameter user and checks that it exists in the database
	 * @param {string} user - Takes parameter user string
	 * @throws {Error} - 'Username not found', if user does not exist in the database
	 * @returns {boolean} - If user does exist in the database, it returns true
	 */
	async checkUser(user) {
		const sql = `SELECT count(*) AS count FROM users WHERE user="${user}";`
		const records = await this.db.get(sql)
		if(!records.count) throw new Error(`username "${user}" not found`)
		return true
	}

	/**
	 * Function which takes an object and adds an admin to the database
	 * @param {Object} ctn - Takes an object which includes admin information
	 * @returns {boolean} - True, if user made succesfully
	 */
	async createAdmin(ctn) {
		const sql = `INSERT INTO users(user, pass, firstName, surname, type) 
		VALUES("${ctn.user}", "${ctn.pass}", "${ctn.firstName}", "${ctn.surname}", "admin");`
		await this.db.run(sql)
		return true
	}
}
