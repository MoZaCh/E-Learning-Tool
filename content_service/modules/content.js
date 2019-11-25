
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
			let sql = `CREATE TABLE IF NOT EXISTS git (id INTEGER PRIMARY KEY AUTOINCREMENT,
				topic TEXT, h1 TEXT, para1 TEXT, h2 TEXT, para2 TEXT, h3 TEXT, para3 TEXT, page TEXT);`
			await this.db.run(sql)
			sql = `CREATE TABLE IF NOT EXISTS html (id INTEGER PRIMARY KEY AUTOINCREMENT,
				topic TEXT, h1 TEXT, para1 TEXT, h2 TEXT, para2 TEXT, h3 TEXT, para3 TEXT, page TEXT);`
			await this.db.run(sql)
			sql = `CREATE TABLE IF NOT EXISTS css (id INTEGER PRIMARY KEY AUTOINCREMENT,
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
		console.log(ctn)
		let sql = `SELECT COUNT(id) as records FROM ${ctn.topic} WHERE topic="${ctn.topic}";`
		const num = await this.db.get(sql)
		await this.isEmpty(num.records)
		sql = `SELECT * FROM ${ctn.topic} WHERE topic="${ctn.topic}" AND page="${ctn.page}";`
		const data = await this.db.get(sql)
		const page = Number(data.page)
		if (page < num.records ) data.nxtP = page+1
		if (page === num.records) data.finish = true
		return data
	}

	async viewContent(ctn) {
		//await this.validateInput(ctn)
		console.log(ctn)
		let sql = `SELECT COUNT(id) as records FROM ${ctn.topic} WHERE id="${ctn.id}";`
		let data = await this.db.get(sql)
		if(data.records === 0) throw new Error('No Content Available')
		sql = `SELECT * FROM ${ctn.topic} WHERE id="${ctn.id}";`
		data = await this.db.get(sql)
		return data
	}

	async getAllContent() {
		//await this.validateInput()
		let sql = 'SELECT COUNT(id) as records FROM git;'
		let data = await this.db.get(sql)
		let sql2 = 'SELECT COUNT(id) as records FROM html;'
		let data2 = await this.db.get(sql2)
		let sql3 = 'SELECT COUNT(id) as records FROM css;'
		let data3 = await this.db.get(sql3)
		if(data.records === 0 & data2.records === 0 & data3.records === 0) throw new Error('No Content Available')
		sql = 'SELECT * FROM git;'
		data = await this.db.all(sql)
		sql2 = 'SELECT * FROM html;'
		data2 = await this.db.all(sql2)
		sql3 = 'SELECT * FROM css;'
		data3 = await this.db.all(sql3)
		data = data.concat(data2)
		data = data.concat(data3)
		return data
	}

	async setContent(ctn) {
		//await this.validateInput(ctn)
		let sql = `SELECT COUNT(id) as records FROM ${ctn.topic};`
		const page = await this.db.get(sql)
		page.records += 1
		const num = String(page.records)
		console.log(num)
		ctn.page = num
		console.log(ctn)
		sql = `INSERT INTO ${ctn.topic}(topic, h1, para1, h2, para2, h3, para3, page) VALUES("${ctn.topic}", 
		"${ctn.h1}", "${ctn.para1}", "${ctn.h2}", "${ctn.para2}", "${ctn.h3}", "${ctn.para3}", "${num}");`
		await this.db.run(sql)
		return true
	}

	async updateContent(ctn) {
		// let sql = `SELECT COUNT(id) as records FROM git WHERE topic="${topic}";`
		// let data = await this.db.get(sql)
		//if(data.records === 0) throw new Error('No Content Available')
		//await this.validateInput(ctn)
		for(const i in ctn) {
			if (typeof ctn[i] === 'undefined' | ctn[i] === '') {
				ctn[i] = ''
			}
		}
		const sql = `Update ${ctn.topic} SET h1="${ctn.h1}", para1="${ctn.para1}",
		h2="${ctn.h2}", para2="${ctn.para2}", 
		h3="${ctn.h3}", para3="${ctn.para3}" WHERE id="${ctn.id}";`
		await this.db.run(sql)
		return true
	}
}
