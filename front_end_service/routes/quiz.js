'use strict'

const Router = require('koa-router')
const router = new Router()

/* IMPORT CUSTOM MODULES */

const Quiz = require('../../quiz_service/modules/quiz.js')
const quizDB = '../quiz_service/quiz.db'
const FrontEnd = require('../modules/front_end')
const auth = require('../modules/authentication')

router.post('/quiz', auth, async ctx => {
	try {
		const body = ctx.request.body
		const quiz = await new Quiz(quizDB)
		const data = await quiz.getRandomQuiz(body.topic)
		await ctx.render('quiz', data)
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
		await ctx.render('quiz-result', result)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/quiz-result', async ctx => {
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('quiz-result', data)
})

module.exports = router
