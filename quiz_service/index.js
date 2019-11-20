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


/* IMPORT CUSTOM MODULES */
const Quiz = require('./modules/quiz')

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
const dbName = 'quiz.db'


router.get('/', async ctx => await ctx.render('index'))


router.get('/topic', async ctx => await ctx.render('topic'))


router.post('/topic', koaBody, async ctx => {
	try {
		const body = ctx.request.body
		console.log(body)
		const quiz = await new Quiz(dbName)
		const data = await quiz.getRandomQuiz('git')
		await ctx.render('index', data)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.post('/quizcomplete', koaBody, async ctx => {
	try {
		const body = ctx.request.body
		console.log(body)
		const quiz = await new Quiz(dbName)
		const result = await quiz.getScore(body, 'git')
		//const quiz = await new Quiz(dbName)
		//await quiz.addQuizQuestions('git')
		//const data = await quiz.viewQuiz('git')
		return ctx.redirect('/index')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))

