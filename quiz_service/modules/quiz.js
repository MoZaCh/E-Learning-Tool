
'use strict'

const sqlite = require('sqlite-async')

const Accounts = require('../../user_service/modules/user.js')
const accountsDB = './user_service/user.db'

module.exports = class Quiz {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			//We need this table to store the quiz
			let sql='CREATE TABLE IF NOT EXISTS git (id INTEGER PRIMARY KEY AUTOINCREMENT,question TEXT, answer TEXT);'
			await this.db.run(sql)
			sql = `CREATE TABLE IF NOT EXISTS quizResults (id INTEGER PRIMARY KEY AUTOINCREMENT,
				user TEXT, topic TEXT, score TEXT, outcome TEXT);`
			await this.db.run(sql)
			sql = 'CREATE TABLE IF NOT EXISTS randomGit (id INTEGER PRIMARY KEY AUTOINCREMENT, ranswer TEXT)'
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
			if (quizObj[each] === '') throw new Error('Missing Value')
			if (typeof quizObj[each] === 'undefined') throw new Error('Missing Value')
		}
	}

	/**
	 * Generates a list of unique random numbers
	 * @param {integer} max - Max specifies a maximum range the numbers should be in
	 * @param {integer} cycle - It provides the number of times a number should be generated
	 * @returns {Array} - Returns an array 'num' with unique numbers
	 */
	async getRandomInt(max, cycle) {
		if (isNaN(max) | typeof max === 'undefined') throw new Error('Missing max')
		if (isNaN(cycle) | typeof cycle === 'undefined') throw new Error('Missing cycle')
		const num = []
		let i = 0
		while (i < cycle) {
			const ranNum = Math.floor(Math.random() * Math.floor(max))
			if (!num.includes(ranNum) & ranNum !== 0) {
				num.push(ranNum)
				i++
			}
		}
		return num
	}

	/**
	 * Gets all the records from the database
	 * @param {string} topic - Takes a string specifies the table to get the data from
	 * @returns {Array} -  Returns an array of objects
	 */
	async viewQuiz(topic) {
		if (!isNaN(topic) | topic === '' | typeof topic === 'undefined') throw new Error('Invalid input')
		try {
			let sql = `SELECT COUNT(*) FROM ${topic};`
			let record = await this.db.get(sql)
			sql = `SELECT question, answer FROM ${topic}`
			record = await this.db.all(sql)
			return record
		} catch(err) {
			throw err
		}
	}

	/**
	 * Generates a list of 10 random questions
	 * @param {string} topic - Takes a string which specifies the table name
	 * @returns {Array} - Returns an array of 10 objects each with question and answer
	 */
	async getRandomQuiz(topic) {
		try {
			const max = 10
			const cycle = 5
			const randomList = await this.getRandomInt(max,cycle)
			const record = []
			for(const i in randomList) {
				const sql = `SELECT question, answer FROM ${topic} WHERE id=${randomList[i]}`
				const eachRow = await this.db.get(sql)
				record.push(eachRow)
			}
			return record
		} catch(err) {
			throw err
		}
	}

	/**
	 * Adds a new question and answer to the topic table
	 * @param {string} topic - Takes a string which specifies the table
	 * @param {string} question - Takes a string which contains the question to be seted
	 * @param {string} answer - Takes a string which contains the answer
	 */
	async setQuizQuestion(topic, question, answer) {
		try {
			const quizObj = {Topic: topic, Question: question, Answer: answer}
			await this.checkParameters(quizObj)
			const sql = `INSERT INTO ${topic}(question, answer) VALUES("${question}", "${answer}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}

	/**
	 * Takes a table name and deletes a question from the table
	 * @param {string} topic - Takes a string which specifies the table name
	 * @param {string} question - Takes a string question which contains the question to be deleted
	 * @param {string} answer - Takes a string answer which contains the answer to be deleted
	 */
	async deleteQuizQuestion(topic, question, answer) {
		try {
			const quizObj = {Topic: topic, Question: question, Answer: answer}
			await this.checkParameters(quizObj)
			let sql = `SELECT count(*) AS count FROM ${topic} WHERE question="${question}" AND answer="${answer}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`"${question}" no match found`)
			sql = `DELETE FROM ${topic} WHERE question="${question}";`
			await this.db.run(sql)
			return true
		} catch(err) {
			throw err
		}
	}
	/**
	 * Takes an integer and returns object containg fail or pass depending on the score
	 * @param {integer} score - Takes input integer
	 * @returns {Object} - Returns Object which contains score and outcome
	 */
	async checkIfFail(score) {
		const pass = 4
		const ten = 10
		const scoreObj = {}
		if (score < pass) {
			scoreObj.score = `${score * ten}%`
			scoreObj.outcome = 'Fail'
		} else {
			scoreObj.score = `${score * ten}%`
			scoreObj.outcome = 'Pass'
		}
		return scoreObj
	}

	/**
	 * Takes input object and table name and returns the score
	 * @param {Object} quizObj -
	 * @param {string} topic -
	 */
	async getScore(quizObj, topic) {
		try {
			if (Object.getOwnPropertyNames(quizObj).length === 0) throw new Error('Invalid data provided')
			await this.checkParameters(quizObj)
			let score = 0
			for (const key in quizObj) {
				const sql=`SELECT COUNT(*) AS count FROM ${topic} Where question="${key}" AND answer="${quizObj[key]}";`
				const eachRow = await this.db.get(sql)
				if (eachRow.count === 1) score++
			}
			const result = this.checkIfFail(score)
			return result
		} catch(err) {
			throw err
		}
	  }

	  async checkUser(user) {
		const accounts = await new Accounts(accountsDB)
		const sql = `SELECT count(*) AS count FROM users WHERE user="${user}";`
		const records = await accounts.db.get(sql)
		if(!records.count) throw new Error(`username "${user}" not found`)
	}

	  async setQuizResult(user, topic, score, outcome) {
		  try {
			  await this.checkUser(user)
			  const sql = `INSERT INTO quizResults(user, topic, score, outcome) 
			  VALUES("${user}", "${topic}", "${score}","${outcome}");`
			  await this.db.run(sql)
			  return true
		} catch(err) {
			  throw err
		  }
	  }

	  async getQuizResult(user) {
		  try {
			  await this.checkUser(user)
			  const sql = `SELECT * FROM quizResults WHERE user="${user}";`
			  const records = await this.db.all(sql)
			  return records
		} catch(err) {
			  throw err

		  }
	  }
}
