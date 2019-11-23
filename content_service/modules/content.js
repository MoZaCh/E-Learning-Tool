
'use strict'

//const bcrypt = require('bcrypt-promise')
// const fs = require('fs-extra')
//const mime = require('mime-types')
const sqlite = require('sqlite-async')
//const saltRounds = 10

module.exports = class Content {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = `CREATE TABLE IF NOT EXISTS content (id INTEGER PRIMARY KEY AUTOINCREMENT,
				topic TEXT, h1 TEXT, para1 TEXT, h2 TEXT, para2 TEXT, h3 TEXT, para3 TEXT, page TEXT);`
			await this.db.run(sql)
			return this
		})()
	}

	async validateInput(strObj) {
		if (Object.getOwnPropertyNames(strObj).length === 0) throw new Error('Empty Object')
		for (const each in strObj) {
			if (strObj[each] === '' | typeof strObj[each] === 'undefined') throw new Error(`Missing ${each}`)
		}
	}

	async getContent(topic, page) {
		let sql = `SELECT COUNT(id) as records FROM content WHERE topic="${topic}";`
		let data = await this.db.get(sql)
		if(data.records === 0) throw new Error('No Content Available')
		sql = `SELECT * FROM content WHERE topic="${topic}" AND page="${page}";`
		data = await this.db.get(sql)
		return data
	}

	async setContent(ctn) {
		const sql = `INSERT INTO content(topic, h1, para1, h2, para2, h3, para3, page) VALUES("${ctn.topic}", 
		"${ctn.h1}", "${ctn.para1}", "${ctn.h2}", "${ctn.para2}", "${ctn.h3}", "${ctn.para3}", "${ctn.page}");`
		console.log(ctn.topic)
		await this.db.run(sql)
		return true
	}

	async updateContent(topic, para1, para2, page) {
		// let sql = `SELECT COUNT(id) as records FROM content WHERE topic="${topic}";`
		// let data = await this.db.get(sql)
		//if(data.records === 0) throw new Error('No Content Available')
		const sql = `Update content SET para1="${para1}", para2="${para2}" WHERE topic="${topic}" AND page="${page}";`
		const data = await this.db.run(sql)
		return true
	}
}
