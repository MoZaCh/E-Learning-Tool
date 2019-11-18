
'use strict'

const Quiz = require('../modules/quiz.js')

describe('checkParameters()', () => {

	test('If empty object is passed it should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		const obj = {}
		await expect( quiz.checkParameters(obj) )
			.rejects.toEqual( Error('Empty Object') )
		done()
	})

	test('If object contains an empty value', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		const obj = {i: ''}
		await expect( quiz.checkParameters(obj) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If object contains an undefined value', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		const obj = {first: 'Heelo', key: undefined}
		await expect( quiz.checkParameters(obj) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if object is undefined it should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.checkParameters() )
			.rejects.toEqual( Error('Cannot convert undefined or null to object') )
		done()
	})
})

describe('getRandomInt()', () => {

	test('Should return a set number of unique integers', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		const data = await quiz.getRandomInt(10, 5)
		expect(data.length).toEqual(5)
		done()
	})

	test('Should return a set number of unique integers matching cycle 6', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		const data = await quiz.getRandomInt(10, 6)
		expect(data.length).toEqual(6)
		done()
	})

	test('Should return nothing if cycle is 0', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		const data = await quiz.getRandomInt(10, 0)
		expect(data.length).toEqual(0)
		done()
	})

	test('Should return nothing if max range is 0', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		const data = await quiz.getRandomInt(10, 0)
		expect(data.length).toEqual(0)
		done()
	})

	test('if max is not a number throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.getRandomInt('t',5 ) )
			.rejects.toEqual( Error('Missing max') )
		done()
	})

	test('if max is undefined throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.getRandomInt(undefined,5 ) )
			.rejects.toEqual( Error('Missing max') )
		done()
	})

	test('if cycle is not a number throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.getRandomInt(5,'t') )
			.rejects.toEqual( Error('Missing cycle') )
		done()
	})

	test('if cycle is undefined throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.getRandomInt(5,undefined) )
			.rejects.toEqual( Error('Missing cycle') )
		done()
	})
})

describe('addQuizQuestion()', () => {

	test('Add a quiz question successfully', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		const addQuestion = await quiz.addQuizQuestions('git', 'What is git?', 'github')
		expect(addQuestion).toBe(true)
		done()
	})

	test('if paremeter topic is missing should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.addQuizQuestions('', 'What is git?', 'github') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if parameter question is missing should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.addQuizQuestions('git', '', 'github') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If parameter answer is missing should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.addQuizQuestions('git', 'What is git?', '') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if paremeter topic is undefined should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.addQuizQuestions(undefined, 'What is git?', 'github') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if parameter question is undefined should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.addQuizQuestions('git', undefined, 'github') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If parameter answer is undefined should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.addQuizQuestions('git', 'What is git?', undefined) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})
})
