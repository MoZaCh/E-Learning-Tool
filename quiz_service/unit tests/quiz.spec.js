
'use strict'

const Quiz = require('../modules/quiz.js')
const Accounts = require('../../user_service/modules/user.js')

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

describe('viewQuiz()', () => {

	test('Should throw an error if empty string is passed', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.viewQuiz('') )
			.rejects.toEqual( Error('Invalid input') )
		done()
	})

	test('Should throw an error if string is undefined', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.viewQuiz(undefined) )
			.rejects.toEqual( Error('Invalid input') )
		done()
	})

	test('Should throw an error if input is a integer', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.viewQuiz(1) )
			.rejects.toEqual( Error('Invalid input') )
		done()
	})

	test('Should throw an error if string has a number', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.viewQuiz('1') )
			.rejects.toEqual( Error('Invalid input') )
		done()
	})

	test('Should throw an error if table deos not exist', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		const topic = 'hello'
		await expect( quiz.viewQuiz(topic) )
			.rejects.toThrow( new Error(`SQLITE_ERROR: no such table: ${topic}`) )
		done()
	})

	test('Should return an empty list from the database', async done => {
		expect.assertions(1)
		const topic = 'git'
		const quiz = await new Quiz()
		const result = await quiz.viewQuiz(topic)
		expect(result).toEqual([])
		done()
	})

	test('Should return a list size of 1 from the database', async done => {
		expect.assertions(1)
		const topic = 'git'
		const quiz = await new Quiz()
		await quiz.setQuizQuestion('git', 'What is git?', 'github')
		const result = await quiz.viewQuiz(topic)
		expect(result.length).toEqual(1)
		done()
	})

	test('Should return a list size of 5 from the database', async done => {
		expect.assertions(1)
		const topic = 'git'
		const quiz = await new Quiz()
		await quiz.setQuizQuestion('git', 'What is git 1?', 'github 1')
		await quiz.setQuizQuestion('git', 'What is git 2?', 'github 2')
		await quiz.setQuizQuestion('git', 'What is git 3?', 'github 3')
		await quiz.setQuizQuestion('git', 'What is git 4?', 'github 4')
		await quiz.setQuizQuestion('git', 'What is git 5?', 'github 5')
		const result = await quiz.viewQuiz(topic)
		expect(result.length).toEqual(5)
		done()
	})
})

describe('getRandomQuiz()', () => {

	test('Should get a randomly generated quiz', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await quiz.setQuizQuestion('git', 'What is git 1?', 'github 1')
		await quiz.setQuizQuestion('git', 'What is git 2?', 'github 2')
		await quiz.setQuizQuestion('git', 'What is git 3?', 'github 3')
		await quiz.setQuizQuestion('git', 'What is git 4?', 'github 4')
		await quiz.setQuizQuestion('git', 'What is git 5?', 'github 5')
		await quiz.setQuizQuestion('git', 'What is git 1?', 'github 1')
		await quiz.setQuizQuestion('git', 'What is git 2?', 'github 2')
		await quiz.setQuizQuestion('git', 'What is git 3?', 'github 3')
		await quiz.setQuizQuestion('git', 'What is git 4?', 'github 4')
		await quiz.setQuizQuestion('git', 'What is git 5?', 'github 5')
		const result = await quiz.getRandomQuiz('git')
		expect(result.length).toEqual(5)
		done()
	})

	test('If no paramter is passed it should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.getRandomQuiz() )
			.rejects.toThrow( new Error('SQLITE_ERROR: no such table: undefined') )
		done()
	})
})

describe('setQuizQuestion()', () => {

	test('Add a quiz question successfully', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		const setQuestion = await quiz.setQuizQuestion('git', 'What is git?', 'github')
		expect(setQuestion).toBe(true)
		done()
	})

	test('if paremeter topic is missing should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.setQuizQuestion('', 'What is git?', 'github') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if parameter question is missing should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.setQuizQuestion('git', '', 'github') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If parameter answer is missing should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.setQuizQuestion('git', 'What is git?', '') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if paremeter topic is undefined should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.setQuizQuestion(undefined, 'What is git?', 'github') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if parameter question is undefined should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.setQuizQuestion('git', undefined, 'github') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If parameter answer is undefined should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.setQuizQuestion('git', 'What is git?', undefined) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})
})

describe('deleteQuizQuestion()', () => {

	test('Delete a quiz question successfully', async done => {
		expect.assertions(2)
		const quiz = await new Quiz()
		await expect(quiz.setQuizQuestion('git', 'What is git?', 'github') )
			.resolves.toBeTruthy()
		await expect(quiz.deleteQuizQuestion('git', 'What is git?', 'github'))
			.resolves.toBeTruthy()
		done()
	})

	test('If question is not found', async done => {
		expect.assertions(2)
		const quiz = await new Quiz()
		await expect(quiz.setQuizQuestion('git', 'What is git?', 'github') )
			.resolves.toBeTruthy()
		await expect( quiz.deleteQuizQuestion('git', 'Not known', 'github') )
			.rejects.toEqual( Error('"Not known" no match found') )
		done()
	})

	test('If answer is not found', async done => {
		expect.assertions(2)
		const quiz = await new Quiz()
		await expect(quiz.setQuizQuestion('git', 'What is git?', 'github') )
			.resolves.toBeTruthy()
		await expect( quiz.deleteQuizQuestion('git', 'What is git?', 'Not Known') )
			.rejects.toEqual( Error('"What is git?" no match found') )
		done()
	})

	test('if topic string does not exist it should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.deleteQuizQuestion('', 'What is git?', 'github') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if question string is missing should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.deleteQuizQuestion('git', '', 'github') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If answer string is missing should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.deleteQuizQuestion('git', 'What is git?', '') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if topic string is undefined should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.deleteQuizQuestion(undefined, 'What is git?', 'github') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if question string is undefined should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.deleteQuizQuestion('git', undefined, 'github') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If answer string is undefined should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.deleteQuizQuestion('git', 'What is git?', undefined) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If parameters are empty', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.deleteQuizQuestion() )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})
})

describe('getScore()', () => {

	test('Empty parameters it should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.getScore() )
			.rejects.toEqual( Error('Cannot convert undefined or null to object') )
		done()
	})

	test('If the object is empty is should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		const obj = {}
		await expect( quiz.getScore(obj, 'git') )
			.rejects.toEqual( Error('Invalid data provided') )
		done()
	})

	test('If object contains missing value', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		const obj = {first: ''}
		await expect( quiz.getScore(obj, 'git') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if object contians undefined value it should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		const obj = {first: undefined}
		await expect( quiz.getScore(obj, 'git') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('Should return 0% and fail', async done => {
		expect.assertions(2)
		const quiz = await new Quiz()
		const obj = {'What is git?': 'github'}
		const result = await quiz.getScore(obj, 'git')
		expect(result.score).toBe('0%')
		expect(result.outcome).toEqual('Fail')
		done()
	})

	test('Should return 10% and fail', async done => {
		expect.assertions(3)
		const quiz = await new Quiz()
		const obj = {'How do you stage files for a commit?': 'git add'}
		await expect(quiz.setQuizQuestion('git', 'How do you stage files for a commit?', 'git add') )
			.resolves.toBeTruthy()
		const result = await quiz.getScore(obj, 'git')
		expect(result.score).toBe('10%')
		expect(result.outcome).toBe('Fail')
		done()
	})

	test('Should return 40% and pass', async done => {
		expect.assertions(2)
		const quiz = await new Quiz()
		const obj = {'Stage files for a commit?': 'git add', 'What is git?': 'github', 'C1': 'C1', 'C2': 'C2'}
		await quiz.setQuizQuestion('git', 'Stage files for a commit?', 'git add')
		await quiz.setQuizQuestion('git', 'What is git?', 'github')
		await quiz.setQuizQuestion('git', 'C1', 'C1')
		await quiz.setQuizQuestion('git', 'C2', 'C2')
		const result = await quiz.getScore(obj, 'git')
		expect(result.score).toBe('40%')
		expect(result.outcome).toEqual('Pass')
		done()
	})
})

describe('setQuizResults()', () => {

	test('If user does exist it should return true', async done => {
		expect.assertions(2)
		const accounts = await new Accounts()
		const quiz = await new Quiz()
		await expect(accounts.register('admin', 'admin', 'admin', 'admin') )
			.resolves.toBeTruthy()
		await expect(quiz.setQuizResult('admin','git','50%', 'Pass'))
			.resolves.toBeTruthy()
		done()
	})

	test('If user does not exist it should throw an error', async done => {
		expect.assertions(2)
		const accounts = await new Accounts()
		const quiz = await new Quiz()
		await expect(accounts.register('admin', 'admin', 'admin', 'admin') )
			.resolves.toBeTruthy()
		await expect(quiz.setQuizResult('hello','git','50%', 'Pass'))
			.rejects.toEqual( Error('username "hello" not found') )
		done()
	})
})

describe('getQuizResults()', () => {

	test('Unknown username should throw an error', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.setQuizResult('Hello') )
			.rejects.toEqual( Error('username "Hello" not found') )
		done()
	})

	test('If a parameter is not passed', async done => {
		expect.assertions(1)
		const quiz = await new Quiz()
		await expect( quiz.getQuizResult() )
			.rejects.toEqual( Error('username "undefined" not found') )
		done()
	})

	test('If user does exist it should return users past results', async done => {
		expect.assertions(3)
		const accounts = await new Accounts()
		const quiz = await new Quiz()
		await expect(accounts.register('admin', 'admin', 'admin', 'admin') )
			.resolves.toBeTruthy()
		await expect(quiz.setQuizResult('admin','git','50%', 'Pass'))
			.resolves.toBeTruthy()
		await expect( quiz.getQuizResult('admin') )
			.resolves.toEqual([{'id': 1, 'outcome': 'Pass', 'score': '50%', 'topic': 'git', 'user': 'admin'}])
		done()
	})
})
