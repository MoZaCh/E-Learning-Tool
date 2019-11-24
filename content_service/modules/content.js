
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
			if (strObj[each] === '' | typeof strObj[each] === 'undefined') throw new Error('Missing parameters')
		}
	}

	async isEmpty(record) {
		if(record === 0) throw new Error('No Content Available')
	}

	async getContent(ctn) {
		await this.validateInput(ctn)
		let sql = `SELECT COUNT(id) as records FROM content WHERE topic="${ctn.topic}";`
		const num = await this.db.get(sql)
		await this.isEmpty(num.records)
		sql = `SELECT * FROM content WHERE topic="${ctn.topic}" AND page="${ctn.page}";`
		const data = await this.db.get(sql)
		const page = Number(data.page)
		if (page < num.records ) data.nxtP = page+1
		if (page === num.records) data.finish = true
		return data
	}

	async viewContent(ctn) {
		//await this.validateInput(ctn)
		let sql = `SELECT COUNT(id) as records FROM content WHERE id="${ctn.id}";`
		let data = await this.db.get(sql)
		if(data.records === 0) throw new Error('No Content Available')
		sql = `SELECT * FROM content WHERE id="${ctn.id}";`
		data = await this.db.get(sql)
		return data
	}

	async getAllContent() {
		//await this.validateInput()
		let sql = 'SELECT COUNT(id) as records FROM content;'
		let data = await this.db.get(sql)
		if(data.records === 0) throw new Error('No Content Available')
		sql = 'SELECT * FROM content;'
		data = await this.db.all(sql)
		return data
	}

	async setContent(ctn) {
		await this.validateInput(ctn)
		const sql = `INSERT INTO content(topic, h1, para1, h2, para2, h3, para3, page) VALUES("${ctn.topic}", 
		"${ctn.h1}", "${ctn.para1}", "${ctn.h2}", "${ctn.para2}", "${ctn.h3}", "${ctn.para3}", "${ctn.page}");`
		await this.db.run(sql)
		return true
	}

	async updateContent(ctn) {
		// let sql = `SELECT COUNT(id) as records FROM content WHERE topic="${topic}";`
		// let data = await this.db.get(sql)
		//if(data.records === 0) throw new Error('No Content Available')
		//await this.validateInput(ctn)
		console.log(ctn, 'inside the function')
		const sql = `Update content SET h1="${ctn.h1}", para1="${ctn.para1}", h2="${ctn.h2}", para2="${ctn.para2}", 
		h3="${ctn.h3}", para3="${ctn.para3}" WHERE id="${ctn.id}";`
		await this.db.run(sql)
		return true
	}
}
