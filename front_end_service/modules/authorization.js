'use strict'

/* IMPORT CUSTOM MODULES */
const Accounts = require('../../user_service/modules/user.js')
const accountsDB = '../user_service/user.db'

module.exports = async(ctx, next) => {
	try{
		const userInfo = ctx.cookies.get('authorization')
		const userRole = ctx.cookies.get('type')
		if(userRole === undefined | userRole === '' | userRole === 'user') {
			return ctx.redirect('/login?msg=you dont have permission')
		}
		const b64array = userInfo.split(' ')
		const utf8str = Buffer.from(b64array[1], 'base64').toString().split(':')
		const accounts = await new Accounts(accountsDB)
		const data = await accounts.userDetails(utf8str[0])
		if(userRole !== data.type) console.log('error')
		await next()
	} catch(err) {
		ctx.response.status = 401
		throw err
	}

}
