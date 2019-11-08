'use strict'

/* IMPORT CUSTOM MODULES */
const User = require('./user')

module.exports = async(ctx, next) => {
	//console.log('Alam the Egg head')
	//console.log(ctx.cookies.get('authorization'))
	const userInfo = ctx.cookies.get('authorization')
	console.log(userInfo)
	if(!ctx.cookies.get('authorization')) {
		return ctx.redirect('/login?msg=you need to log in')
	}
	const b64array = Buffer.from(userInfo, 'base64').toString().split(' ')
	console.log(b64array)
	const userPass = b64array[1].split(':')
	console.log(userPass)
	const user = userPass[0]
	const pass = userPass[1]
	next()
}
