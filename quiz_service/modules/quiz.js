
'use strict'

const sqlite = require('sqlite-async')

//const Accounts = require('../../user_service/modules/user.js')
//const accountsDB = '../../user_service/user.db'

module.exports = class Quiz {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			//We need this table to store the quiz
			let sql=`CREATE TABLE IF NOT EXISTS git (id INTEGER PRIMARY KEY AUTOINCREMENT,question TEXT,
				answer TEXT, random1 TEXT, random2 TEXT, random3 TEXT);`
			await this.db.run(sql)
			sql = `CREATE TABLE IF NOT EXISTS quizResults (id INTEGER PRIMARY KEY AUTOINCREMENT,
				user TEXT, topic TEXT, score TEXT, outcome TEXT);`
			await this.db.run(sql)
			sql = `CREATE TABLE IF NOT EXISTS html (id INTEGER PRIMARY KEY AUTOINCREMENT,question TEXT,
				answer TEXT, random1 TEXT, random2 TEXT, random3 TEXT);`
			await this.db.run(sql)
			sql = `CREATE TABLE IF NOT EXISTS css (id INTEGER PRIMARY KEY AUTOINCREMENT,question TEXT,
				answer TEXT, random1 TEXT, random2 TEXT, random3 TEXT);`
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
		if (isNaN(max) | typeof max === 'undefined' | max === '') throw new Error('Missing max')
		if (isNaN(cycle) | typeof cycle === 'undefined' | cycle === '') throw new Error('Missing cycle')
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
	 * @throws {Error} - "Invalid input", if topic is an empty string or undefined
	 * @returns {Array} -  Returns an array of objects - questions and answers
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
			const max = 20
			const cycle = 10
			const randomList = await this.getRandomInt(max,cycle)
			const record = []
			for(const i in randomList) {
				const sql = `SELECT question, answer, random1, random2, random3 FROM ${topic} WHERE id=${randomList[i]}`
				const eachRow = await this.db.get(sql)
				record.push(eachRow)
			}
			record.push({topic: `${topic}`})


			return record
		} catch(err) {
			throw err
		}
	}

	/**
	 * Adds a new question and answer to the topic table
	 * @param {Object} ctn - Takes an object containing topic, question and answers
	 * @returns {boolean} - Returns true, if succsefully added to database
	 */
	async setQuizQuestion(ctn) {
		try {
			await this.checkParameters(ctn)
			const sql = `INSERT INTO ${ctn.topic}(question, answer, random1, random2, random3) 
			VALUES("${ctn.question}", "${ctn.answer}", "${ctn.rand1}", "${ctn.rand2}", "${ctn.rand3}");`
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
	async deleteQuizQuestion(ctn) {
		try {
			await this.checkParameters(ctn)
			let sql = `SELECT count(*) AS count FROM ${ctn.topic} 
			WHERE question="${ctn.question}" AND answer="${ctn.answer}";`
			const records = await this.db.get(sql)
			if(!records.count) throw new Error(`"${ctn.question}" no match found`)
			sql = `DELETE FROM ${ctn.topic} WHERE question="${ctn.question}";`
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
	 * @param {Object} quizObj - Contains the questions and answers that the user attempted
	 * @param {string} topic - Contains the topic name
	 * @throws {Error} - 'Invalid data provided, if object is empty
	 * @returns {Object} - Containing the score and the outcome, whether is it a pass or fail
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
			const result = await this.checkIfFail(score)
			return result
		} catch(err) {
			throw err
		}
	  }

	  /**
	   * Function which takes parameters user, topic, score and outcome and sets the quiz result in the database
	   * @param {string} user - Takes parameter user string which specifies the user
	   * @param {string} topic - Takes parameter topic string which specifies the table & topic
	   * @param {string} score - Takes parameter score string which indicates the quiz score
	   * @param {string} outcome - Takes parameter outcome string which indicates whether use has passed or failed
	   * @returns {boolean} - True, if succesffully added to the database
	   */
	  async setQuizResult(user, topic, score, outcome) {
		  try {
			const setQuizObj = {Username: user, Topic: topic, Score: score, Outcome: outcome}
			await this.checkParameters(setQuizObj)
			const sql = `INSERT INTO quizResults(user, topic, score, outcome) 
			VALUES("${user}", "${topic}", "${score}","${outcome}");`
			await this.db.run(sql)
			return true
		} catch(err) {
			  throw err
		  }
	  }

	  /**
	   * Function which takes parameter user and gets all the quiz results related to that specific user
	   * @param {string} user - Takes parameter user string which specifies the user
	   * @returns {Object} - Returns key-value pairs of quiz result, if user exists in the database
	   */
	  async getQuizResult(user) {
		  try {
			const getQuizObj = {Username: user}
			await this.checkParameters(getQuizObj)
			const sql = `SELECT * FROM quizResults WHERE user="${user}";`
			const records = await this.db.all(sql)
			return records
		} catch(err) {
			  throw err

		  }
	  }
}
