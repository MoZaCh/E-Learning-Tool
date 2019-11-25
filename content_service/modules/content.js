
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
			sql = `CREATE TABLE IF NOT EXISTS img (id INTEGER PRIMARY KEY AUTOINCREMENT,
				topic TEXT, img1 TEXT, img2 TEXT);`
			await this.db.run(sql)
			return this
		})()
	}
	/**
	 * Checks that the key-value pairs in the object passed are not empty or undefined
	 * @param {Object} strObj - Takes an object with key value pairs
	 * @throws {Error} - Missing parameters, if parameter passed is empty or undefined
	 */
	async validateInput(strObj) {
		if (Object.getOwnPropertyNames(strObj).length === 0) throw new Error('Empty Object')
		for (const each in strObj) {
			if (strObj[each] === '' | typeof strObj[each] === 'undefined') throw new Error('Missing parameters')
		}
	}

	/**
	 * Checks the number passed is not empty
	 * @param {number} record - A number which is passed in as a parameter
	 * @throws {Error} - No Content Available, if number passed is 0 the database is empty
	 */
	async isEmpty(record) {
		if(record === 0) throw new Error('No Content Available')
	}

	/**
	 * Function to insert image paths to the database
	 * @param {string} topic - Takes a string value topic which is used to insert into the table
	 * @param {string} img1 - Takes string img1 which includes the path to the image
	 * @param {string} img2 - Takes string img2 which includes the path to the image
	 * @returns {boolean} - True, if succesfully inserted into the database
	 */
	async setImg(topic, img1, img2) {
		const sql = `INSERT INTO img (topic, img1, img2) VALUES("${topic}", "${img1}", "${img2}");`
		await this.db.run(sql)
		return true
	}

	/**
	 * Takes parameter topic which indicates the topic name
	 * @param {string} topic - Takes a string value topic which is used to retrieve images for that specific table
	 * @returns {Object} - Returns the data pulled from the database (image location)
	 * @returns {boolean} - Retunrs false, if no records are in the databaes
	 */
	async getImg(topic) {
		let sql = `SELECT COUNT(id) as records FROM img WHERE topic="${topic}";`
		const num = await this.db.get(sql)
		if (num.records > 0) {
			sql = `SELECT img1, img2 FROM img WHERE topic="${topic}";`
			const data = await this.db.get(sql)
			for (const i in data) {
				if (data[i] === null | data[i] === '') {
					data[i] = false
				}
			}
			return data
		}
		return false
	}

	/**
	 * Function to get 
	 * @param {*} ctn 
	 */
	async getContent(ctn) {
		await this.validateInput(ctn)
		let sql = `SELECT COUNT(id) as records FROM ${ctn.topic} WHERE topic="${ctn.topic}";`
		const num = await this.db.get(sql)
		await this.isEmpty(num.records)
		const dataImg = await this.getImg(ctn.topic)
		sql = `SELECT * FROM ${ctn.topic} WHERE topic="${ctn.topic}" AND page="${ctn.page}";`
		const data = await this.db.get(sql)
		const page = Number(data.page)
		if (page < num.records ) data.nxtP = page+1
		if (page === num.records) data.finish = true
		if (dataImg !== false) {
			data.img1 = dataImg.img1
			data.img2 = dataImg.img2
		}
		return data
	}

	async viewContent(ctn) {
		let sql = `SELECT COUNT(id) as records FROM ${ctn.topic} WHERE id="${ctn.id}";`
		let data = await this.db.get(sql)
		if(data.records === 0) throw new Error('No Content Available')
		sql = `SELECT * FROM ${ctn.topic} WHERE id="${ctn.id}";`
		data = await this.db.get(sql)
		return data
	}

	async getAllContent() {
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
		await this.validateInput(ctn)
		let sql = `SELECT COUNT(id) as records FROM ${ctn.topic};`
		const page = await this.db.get(sql)
		page.records += 1
		const num = String(page.records)
		ctn.page = num
		sql = `INSERT INTO ${ctn.topic}(topic, h1, para1, h2, para2, h3, para3, page) VALUES("${ctn.topic}", 
		"${ctn.h1}", "${ctn.para1}", "${ctn.h2}", "${ctn.para2}", "${ctn.h3}", "${ctn.para3}", "${num}");`
		await this.db.run(sql)
		return true
	}

	async updateContent(ctn) {
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
