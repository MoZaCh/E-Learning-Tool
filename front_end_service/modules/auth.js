// 'use strict'

// /* IMPORT CUSTOM MODULES */
// const User = require('./user')

// const dbName = 'user.db'

// module.exports = async(ctx, next) => {
// 	try{
// 		const userInfo = ctx.cookies.get('authorization')
// 		if(ctx.cookies.get('authorization') === undefined) return ctx.redirect('/login?msg=you need to log in')
// 		const b64array = Buffer.from(userInfo, 'base64').toString().split(' ')
// 		const userPass = b64array[1].split(':')
// 		const user = await new User(dbName)
// 		await user.login(userPass[0], userPass[1])
// 		await next()
// 	} catch(err) {
// 		//ctx.status = 401
// 		//ctx.redirect('/login?msg=you need to log in')
// 		throw err
// 	}

// }
