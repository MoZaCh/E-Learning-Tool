
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


	async checkParameters(quizObj) {
		if (Object.getOwnPropertyNames(quizObj).length === 0) throw new Error('Empty Object')
		for (const each in quizObj) {
			if (quizObj[each] === '' | typeof quizObj[each] === 'undefined') throw new Error(`Missing ${each}`)
		}
	}
}
