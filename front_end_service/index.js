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
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch(err) {
		await ctx.render('error', {message: err.message, page: '/register'})
		ctx.redirect(`/register?msg=${err.message}`)
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
	} catch(err) {
		ctx.redirect(`/login?msg=${err.message}`)
		//await ctx.render('login', {message: err.message, page: '/login'})
	}
})

router.get('/logout', auth, async ctx => {
	ctx.session.authorised = null
	ctx.cookies.set('authorization','')
	ctx.cookies.set('type', '')
	ctx.redirect('/?msg=you are now logged out')
})

router.get('/homepage', auth, async ctx => {
	const frontController = await new FrontEnd()
	const userPass = await frontController.convertToString(ctx.cookies.get('authorization'))
	const accounts = await new Accounts(accountsDB)
	const data = await accounts.userDetails(userPass[0], userPass[1])
	const quiz = await new Quiz(quizDB)
	data.scores = await quiz.getQuizResult(userPass[0])
	console.log(data)
	await ctx.render('homepage', data)
})

router.post('/content', async ctx => {
	const body = ctx.request.body
	console.log(body, "<<<<<<<>>>>>")
	const content = await new Content(contentDB)
	const data = await content.getContent(body)
	await ctx.render('git-topic', data)
})

router.get('/adminpanel', auth, authorization, async ctx => {
	console.log('Authentication Successful')
	const data = {}
	const content = await new Content(contentDB)
	data.content = await content.getAllContent()
	await ctx.render('adminpanel', data)
})

router.post('/edit', async ctx => {
	const data = {}
	const body = ctx.request.body
	const content = await new Content(contentDB)
	data.content = await content.viewContent(body)
	await ctx.render('edit-panel', data)
})

router.post('/updatecontent', async ctx => {
	const body = ctx.request.body
	const content = await new Content(contentDB)
	console.log(koaBody)
	await content.updateContent(body)
	return ctx.redirect('/login?msg=updated sucessfulyl')
})

//router.get('/git-topic', async ctx => await ctx.render('git-topic', data))


router.get('/git-topic2', async ctx => await ctx.render('git-topic2'))

router.post('/quiz', async ctx => {
	try {
		const body = ctx.request.body
		console.log(body)
		const quiz = await new Quiz(quizDB)
		const data = await quiz.getRandomQuiz(body.topic)
		data.push({topic: `${body.topic}`})
		console.log(data)
		await ctx.render(`${body.topic}-quiz`, data)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.post('/quizcomplete', async ctx => {
	try {
		const body = ctx.request.body
		const quiz = await new Quiz(quizDB)
		const result = await quiz.getScore(body, body.topic)
		const frontController = await new FrontEnd()
		const user = await frontController.convertToString(ctx.cookies.get('authorization'))
		await quiz.setQuizResult(user[0], body.topic, result.score, result.outcome)
		return ctx.redirect(`/quiz-result?msg=${result.score} You have ${result.outcome}`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/quiz-result', async ctx => {
	const data = {}
	console.log(ctx.request.url)
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('quiz-result', data)
})

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
