#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const session = require('koa-session')
//const jimp = require('jimp')

/* IMPORT CUSTOM MODULES */
const Accounts = require('../user_service/modules/user.js')
const accountsDB = '../user_service/user.db'
const FrontEnd = require('./modules/front_end')
const auth = require('./modules/auth')

const app = new Koa()
const router = new Router()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, { extension: 'handlebars' }, {map: { handlebars: 'handlebars' }}))

const defaultPort = 8080
const port = process.env.PORT || defaultPort
//const dbName = 'user.db'

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/', async ctx => await ctx.render('index'))

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		// call the functions in the module
		const accounts = await new Accounts(accountsDB)
		await accounts.register(body.user, body.pass, body.firstName, body.surname)
		// await user.uploadPicture(path, type)
		// redirect to the home page
		console.log(body.name)
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch(err) {
		await ctx.render('error', {message: err.message, page: '/register'})
	}
})

router.get('/login', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const accounts = await new Accounts(accountsDB)
		const result = await accounts.login(body.user, body.pass)
		const role = await accounts.userDetails(body.user)
		const frontController = await new FrontEnd()
		const userBase64 = await frontController.convertToBase(body.user, body.pass)
		if (result === true) {
			await ctx.cookies.set('authorization', userBase64)
			await ctx.cookies.set('type', role.type)
			ctx.session.authorised = true
		}
		return ctx.redirect('/homepage?msg=logged in')
		//ctx.redirect('/?msg=you are now logged in...')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.cookies.set('authorization','')
	console.log('Logout')
	console.log(ctx.cookies.get('authorization'))
	ctx.redirect('/?msg=you are now logged out')
})

router.get('/homepage', auth, async ctx => {
	console.log('Sucessfully Logged In')
	//console.log(ctx.cookies.get('authorization'))
	await ctx.render('homepage')
})

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
