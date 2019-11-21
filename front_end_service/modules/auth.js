'use strict'

/* IMPORT CUSTOM MODULES */
const Accounts = require('../../user_service/modules/user.js')
const accountsDB = '../user_service/user.db'

module.exports = async(ctx, next) => {
	try{
		const userInfo = ctx.cookies.get('authorization')
		console.log(userInfo)
		if(ctx.cookies.get('authorization') === undefined | ctx.cookies.get('authorization') === 'Basic Og==') {
			return ctx.redirect('/login?msg=you need to log in')
		}
		const b64array = Buffer.from(userInfo, 'base64').toString().split(' ')
		const userPass = b64array[1].split(':')
		const accounts = await new Accounts(accountsDB)
		await accounts.login(userPass[0], userPass[1])
		await next()
	} catch(err) {
		ctx.response.status = 401
		throw err
	}

}
