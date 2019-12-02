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
const Quiz = require('../quiz_service/modules/quiz.js')
const quizDB = '../quiz_service/quiz.db'
const Content = require('../content_service/modules/content.js')
const contentDB = '../content_service/content.db'
const FrontEnd = require('./modules/front_end')
const auth = require('./modules/authentication')
const authorization = require('./modules/authorization')
const quizRouter = require('./routes/quiz.js')

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

/**
 * The website index page
 *
 * @name Home Page
 * @route {GET} / - Renders the index page
 */
router.get('/', async ctx => await ctx.render('index'))

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register - Renders the register page
 */
router.get('/register', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('register', data)
})

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register - Registers a new user and redirects the user
 */
router.post('/register', koaBody, async ctx => {
	try {
		const body = ctx.request.body
		const accounts = await new Accounts(accountsDB)
		await accounts.register(body.user, body.pass, body.firstName, body.surname)
		ctx.redirect(`/login?msg=new user ${body.firstName} added`)
	} catch(err) {
		await ctx.render('error', {message: err.message, page: '/register'})
	}
})

/**
 * The user login page
 * @name Login page
 * @route {GET} - Render the login page
 */
router.get('/login', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})

/**
 * The script to process login
 * @name Login script
 * @route {POST} /login - Logs the user in
 */
router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const accounts = await new Accounts(accountsDB)
		const result = await accounts.login(body.user, body.pass)
		const role = await accounts.userDetails(body.user)
		const frontController = await new FrontEnd()
		const userBase64 = await frontController.convertToBase(body.user, body.pass)
		if (result === true) {
			await ctx.cookies.set('authorization', userBase64), await ctx.cookies.set('type', role.type)
			ctx.session.authorised = true
		}
		return ctx.redirect('/homepage?msg=logged in')
	} catch(err) {
		ctx.redirect(`/login?msg=${err.message}`)
	}
})

/**
 * User logout page
 * @name Logout page
 * @route {GET} - Redirects the user to the index page after logout / Protected route
 */
router.get('/logout', auth, async ctx => {
	ctx.session.authorised = null, ctx.cookies.set('authorization',''), ctx.cookies.set('type', '')
	ctx.redirect('/?msg=you are now logged out')
})

/**
 * User Home page
 * @name Homa page
 * @route {GET} - Renders the homepage / Protected route
 */
router.get('/homepage', auth, async ctx => {
	try {
		const frontController = await new FrontEnd()
		const userPass = await frontController.convertToString(ctx.cookies.get('authorization'))
		const accounts = await new Accounts(accountsDB)
		const data = await accounts.userDetails(userPass[0], userPass[1])
		const quiz = await new Quiz(quizDB)
		data.scores = await quiz.getQuizResult(userPass[0])
		await ctx.render('homepage', data)
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The script to process view content
 * @name Content page
 * @route {POST} /content - Script that gets the content / renders the content page / Protected route
 */
router.post('/content', auth, async ctx => {
	const body = ctx.request.body
	const content = await new Content(contentDB)
	const data = await content.getContent(body)
	await ctx.render('topic', data)
})

/**
 * Admin panel page
 * @name Adminpanel page
 * @route {GET} - Renders the adminpanel / Protected route
 */
router.get('/adminpanel', auth, authorization, async ctx => {
	try {
		const data = {}
		const content = await new Content(contentDB)
		data.content = await content.getAllContent()
		await ctx.render('adminpanel', data)
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The script to process content changes
 * @name Edit page
 * @route {POST} /edit - Renders the edit-panel page
 */
router.post('/edit', auth, authorization, async ctx => {
	try {
		const data = {}
		const frontController = await new FrontEnd()
		const body = await frontController.makeObj(ctx.request.body)
		const content = await new Content(contentDB)
		data.content = await content.viewContent(body)
		await ctx.render('edit-panel', data)
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The script to process updatecontent
 * @name Updatecontent page
 * @route {POST} /updatecontent - Redirects the user to the adminpanel
 */
router.post('/updatecontent', auth, authorization, async ctx => {
	try {
		const body = ctx.request.body
		const content = await new Content(contentDB)
		await content.updateContent(body)
		return ctx.redirect('/adminpanel?msg=updated sucessfulyl')
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The script to process adding a screen
 * @name addpage
 * @route {POST} /addpage - Renders the git-topic2 page
 */
router.post('/addpage', auth, authorization, async ctx => {
	try {
		const data = ctx.request.body
		await ctx.render('git-topic2', data)
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The script to process submitting a new page
 * @name submitaddpage
 * @route {POST} /submitaddpage - Redirects the user to the adminpanel
 */
router.post('/submitaddpage', auth, authorization, async ctx => {
	try {
		const data = ctx.request.body
		const content = await new Content(contentDB)
		await content.setContent(data)
		return ctx.redirect('/adminpanel')
	} catch (err) {
		await ctx.render('error', {message: err.message})
	}
})

app.use(router.routes())
app.use(quizRouter.routes())
app.use(quizRouter.allowedMethods())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
