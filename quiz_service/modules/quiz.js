
'use strict'

const sqlite = require('sqlite-async')

module.exports = class Quiz {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			//We need this table to store the quiz
			const sql = `CREATE TABLE IF NOT EXISTS git (id INTEGER PRIMARY KEY AUTOINCREMENT,
				question TEXT, answer TEXT);`
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * Checks that parameters are not blank
	 * @param {Object} quizObj - The object contains paramaters that need to checked if left blank
	 * @throws {Error} - Throws error if the object passed is left blank
	 * @throws {Error} - Throws error message "Missing <parameter> depending on which is left blank"
	 */
	async checkParameters(quizObj) {
		if (Object.getOwnPropertyNames(quizObj).length === 0) throw new Error('Empty Object')
		for (const each in quizObj) {
			if (quizObj[each] === '' | typeof quizObj[each] === 'undefined') throw new Error(`Missing ${each}`)
		}
	}

	/**
	 * Generates a list of unique random numbers
	 * @param {integer} max - Max specifies a maximum range the numbers should be in
	 * @param {integer} cycle - It provides the number of times a number should be generated
	 * @returns {list} - Returns a list 'num' with unique numbers
	 */
	async getRandomInt(max, cycle) {
		if (isNaN(max) | typeof max === 'undefined') throw new Error('Missing max')
		if (isNaN(cycle) | typeof cycle === 'undefined') throw new Error('Missing cycle')
		const num = []
		let i = 0
		while (i < cycle) {
			const ranNum = Math.floor(Math.random() * Math.floor(max))
			if (!num.includes(ranNum)) {
				num.push(ranNum)
				i++
			}
		}
		return num
	}
}
