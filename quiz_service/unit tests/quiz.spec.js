
'use strict'

const Quiz = require('../modules/quiz.js')
const Accounts = require('../../user_service/modules/user.js')

describe('checkParameters()', () => {

	test('If empty object is passed it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		const obj = {}
		//Act & Assert
		await expect( quiz.checkParameters(obj) )
			.rejects.toEqual( Error('Empty Object') )
		done()
	})

	test('If object contains an empty value it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		const obj = {i: ''}
		//Act & Assert
		await expect( quiz.checkParameters(obj) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If object contains an undefined value it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		const obj = {first: 'Heelo', key: undefined}
		//Act & Assert
		await expect( quiz.checkParameters(obj) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if object is undefined it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.checkParameters() )
			.rejects.toEqual( Error('Cannot convert undefined or null to object') )
		done()
	})

	test('It should throw an error if the second key-value contains undefined', async done => {
		expect.assertions(1)
		//Arrange
		const data = {question1: 'Ans', question2: undefined}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.checkParameters(data) )
			.rejects.toEqual( Error('Missing Value'))
		done()
	})

	test('It should throw an error if the second key-value contains empty string', async done => {
		expect.assertions(1)
		//Arrange
		const data = {question1: 'Ans', question2: ''}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.checkParameters(data) )
			.rejects.toEqual( Error('Missing Value'))
		done()
	})

	test('It should not return if successfully iterated through object', async done => {
		expect.assertions(0)
		//Arrange
		const data = {question1: 'Ans', question2: 'ans2'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.checkParameters(data) )
			.resolves
		done()
	})
})

describe('getRandomInt()', () => {

	test('Should return a set of unique integers', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act
		const data = await quiz.getRandomInt(10, 5)
		//Assert
		expect(data.length).toEqual(5)
		done()
	})

	test('Should return a set number of unique integers matching cycle 6', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act
		const data = await quiz.getRandomInt(10, 6)
		//Assert
		expect(data.length).toEqual(6)
		done()
	})

	test('Should return a set number of unique integers matching cycle 1', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act
		const data = await quiz.getRandomInt(10, 1)
		//Assert
		expect(data.length).toEqual(1)
		done()
	})

	test('Should return nothing if cycle is 0', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act
		const data = await quiz.getRandomInt(10, 0)
		//Assert
		expect(data.length).toEqual(0)
		done()
	})

	test('Should return nothing if max range is 0', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act
		const data = await quiz.getRandomInt(10, 0)
		//Assert
		expect(data.length).toEqual(0)
		done()
	})

	test('if max is not a number it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.getRandomInt('t',5 ) )
			.rejects.toEqual( Error('Missing max') )
		done()
	})

	test('if max is undefined it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.getRandomInt(undefined,5 ) )
			.rejects.toEqual( Error('Missing max') )
		done()
	})

	test('if cycle is not a number it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.getRandomInt(5,'t') )
			.rejects.toEqual( Error('Missing cycle') )
		done()
	})

	test('if cycle is undefined it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.getRandomInt(5,undefined) )
			.rejects.toEqual( Error('Missing cycle') )
		done()
	})

	test('if cycle is an empty string it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.getRandomInt(5,'') )
			.rejects.toEqual( Error('Missing cycle') )
		done()
	})

	test('if max is an empty string it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.getRandomInt('',5) )
			.rejects.toEqual( Error('Missing max') )
		done()
	})

	test('if both parameters are empty strings it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.getRandomInt('','') )
			.rejects.toEqual( Error('Missing max') )
		done()
	})
})

describe('viewQuiz()', () => {

	test('Should throw an error if empty string is passed', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.viewQuiz('') )
			.rejects.toEqual( Error('Invalid input') )
		done()
	})

	test('Should throw an error if string is undefined', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.viewQuiz(undefined) )
			.rejects.toEqual( Error('Invalid input') )
		done()
	})

	test('Should throw an error if input is an integer 1', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.viewQuiz(1) )
			.rejects.toEqual( Error('Invalid input') )
		done()
	})

	test('Should throw an error if input is an integer 0', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.viewQuiz(0) )
			.rejects.toEqual( Error('Invalid input') )
		done()
	})

	test('Should throw an error if input is 0.0', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.viewQuiz(0.0) )
			.rejects.toEqual( Error('Invalid input') )
		done()
	})

	test('Should throw an error if input is an integer -1', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.viewQuiz(-1) )
			.rejects.toEqual( Error('Invalid input') )
		done()
	})

	test('Should throw an error if string has a number', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.viewQuiz('1') )
			.rejects.toEqual( Error('Invalid input') )
		done()
	})

	test('Should throw an error if table deos not exist', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		const topic = 'hello'
		//Act & Assert
		await expect( quiz.viewQuiz(topic) )
			.rejects.toThrow( new Error(`SQLITE_ERROR: no such table: ${topic}`) )
		done()
	})

	test('Should return an empty list from the database', async done => {
		expect.assertions(1)
		//Arrange
		const topic = 'git'
		const quiz = await new Quiz()
		//Act
		const result = await quiz.viewQuiz(topic)
		//Assert
		expect(result).toEqual([])
		done()
	})

	test('Should return a list size of 1 from the database', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', rand1: 'git1', rand2: 'git2', rand3: 'git3'}
		const quiz = await new Quiz()
		//Act
		await quiz.setQuizQuestion(data)
		const result = await quiz.viewQuiz('git')
		//Assert
		expect(result.length).toEqual(1)
		done()
	})

	test('Should return a list size of 5 from the database', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', rand1: 'git1', rand2: 'git2', rand3: 'git3'}
		const quiz = await new Quiz()
		//Act
		await quiz.setQuizQuestion(data)
		await quiz.setQuizQuestion(data)
		await quiz.setQuizQuestion(data)
		await quiz.setQuizQuestion(data)
		await quiz.setQuizQuestion(data)
		const result = await quiz.viewQuiz('git')
		//Assert
		expect(result.length).toEqual(5)
		done()
	})
})

describe('getRandomQuiz()', () => {

	test('Should get a randomly generated quiz', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', rand1: 'git1', rand2: 'git2', rand3: 'git3'}
		const quiz = await new Quiz()
		//Act
		await quiz.setQuizQuestion(data)
		await quiz.setQuizQuestion(data)
		await quiz.setQuizQuestion(data)
		await quiz.setQuizQuestion(data)
		await quiz.setQuizQuestion(data)
		await quiz.setQuizQuestion(data)
		await quiz.setQuizQuestion(data)
		await quiz.setQuizQuestion(data)
		await quiz.setQuizQuestion(data)
		await quiz.setQuizQuestion(data)
		const result = await quiz.getRandomQuiz('git')
		//Assert
		expect(result.length).toEqual(11)
		done()
	})

	test('If no paramter is passed it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.getRandomQuiz() )
			.rejects.toThrow( new Error('SQLITE_ERROR: no such table: undefined') )
		done()
	})
})

describe('setQuizQuestion()', () => {

	test('Add a quiz question successfully it should return true', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', answer: 'ans', rand1: 'g1', rand2: 'g2', rand3: 'g3'}
		const quiz = await new Quiz()
		//Act
		const setQuestion = await quiz.setQuizQuestion(data)
		//Assert
		expect(setQuestion).toBe(true)
		done()
	})

	test('if topic name is missing should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizQuestion('', 'What is git?', 'github') )
			.rejects.toThrow( new Error('SQLITE_ERROR: no such table: undefined') )
		done()
	})

	test('if topic parameter is missing should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: '', question: 'What is git?', answer: 'ans', rand1: 'git1', rand2: 'git2', rand3: 'git3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if parameter question is missing should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: '', answer: 'ans', rand1: 'git1', rand2: 'git2', rand3: 'git3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If parameter answer is missing should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', answer: '', rand1: 'git1', rand2: 'git2', rand3: 'git3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If parameter random1 is missing should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', answer: 'ans', rand1: '', rand2: 'git2', rand3: 'git3'}
		const quiz = await new Quiz()
		//act & assert
		await expect( quiz.setQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If parameter random2 is missing should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', answer: 'ans', rand1: 'git1', rand2: '', rand3: 'git3'}
		const quiz = await new Quiz()
		//act & assert
		await expect( quiz.setQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If parameter random3 is missing should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', answer: 'ans', rand1: 'git1', rand2: 'git2', rand3: ''}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if paremeter topic is undefined should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: undefined, question: 'What is git?', answer: 'ans', rand1: '', rand2: 'g1', rand3: 'gi3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if parameter question is undefined should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: undefined, answer: 'ans', rand1: '', rand2: 'git2', rand3: 'git3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If parameter answer is undefined should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', answer: undefined, rand: 'g1', rand2: 'g2', rand3: 'g3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If parameter random1 is undefined should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', answer: 'ans1', rand: undefined, rand2: 'g2', rand3: 'g3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If parameter random2 is undefined should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', answer: 'ans1', rand: 'g1', rand2: undefined, rand3: 'g3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If parameter random3 is undefined should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', answer: 'ans1', rand: 'g1', rand2: 'g2', rand3: undefined}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})
})

describe('deleteQuizQuestion()', () => {

	test('Delete a quiz question successfully', async done => {
		expect.assertions(2)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', answer: 'ans1', rand: 'g1', rand2: 'g2', rand3: 'g3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect(quiz.setQuizQuestion(data) )
			.resolves.toBeTruthy()
		await expect(quiz.deleteQuizQuestion(data))
			.resolves.toBeTruthy()
		done()
	})

	test('If question is not found', async done => {
		expect.assertions(2)
		//Arrange
		let data = {topic: 'git', question: 'What is git?', answer: 'ans1', rand: 'g1', rand2: 'g2', rand3: 'g3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect(quiz.setQuizQuestion(data) )
			.resolves.toBeTruthy()
		data = {topic: 'git', question: 'Not known', answer: 'hello'}
		await expect( quiz.deleteQuizQuestion(data) )
			.rejects.toEqual( Error('"Not known" no match found') )
		done()
	})

	test('If answer is not found', async done => {
		expect.assertions(2)
		//Arrange
		let data = {topic: 'git', question: 'What is git?', answer: 'ans1', rand: 'g1', rand2: 'g2', rand3: 'g3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect(quiz.setQuizQuestion(data) )
			.resolves.toBeTruthy()
		data = {topic: 'git', question: 'What is git?', answer: 'hello'}
		await expect( quiz.deleteQuizQuestion(data) )
			.rejects.toEqual( Error('"What is git?" no match found') )
		done()
	})

	test('if topic string does not exist it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: '', question: 'What is git?', answer: 'ans1', rand: 'g1', rand2: 'g2', rand3: 'g3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.deleteQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if question string is missing should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: '', answer: 'ans1', rand: 'g1', rand2: 'g2', rand3: 'g3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.deleteQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If answer string is missing should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', answer: '', rand: 'g1', rand2: 'g2', rand3: 'g3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.deleteQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if topic string is undefined should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: undefined, question: 'What is git?', answer: 'ans1', rand: 'g1', rand2: 'g2', rand3: 'g3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.deleteQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if question string is undefined should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: undefined, answer: 'ans1', rand: 'g1', rand2: 'g2', rand3: 'g3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.deleteQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If answer string is undefined should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: 'What is git?', answer: undefined, rand: 'g1', rand2: 'g2', rand3: 'g3'}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.deleteQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If object are empty it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.deleteQuizQuestion(data) )
			.rejects.toEqual( Error('Empty Object') )
		done()
	})

	test('If parameters are empty it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: '', question: '', answer: ''}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.deleteQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('It should throw an error if the second value of the object is an empty string', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: ''}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.deleteQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('It should throw an error if the second value of the object is undefined', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', question: undefined}
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.deleteQuizQuestion(data) )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('If no object is passed it should throw an error ', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.deleteQuizQuestion() )
			.rejects.toEqual( Error('Cannot convert undefined or null to object') )
		done()
	})
})

describe('getScore()', () => {

	test('Empty parameters it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.getScore() )
			.rejects.toEqual( Error('Cannot convert undefined or null to object') )
		done()
	})

	test('If the object is empty is should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		const obj = {}
		//Act & Assert
		await expect( quiz.getScore(obj, 'git') )
			.rejects.toEqual( Error('Invalid data provided') )
		done()
	})

	test('If object contains missing value should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		const obj = {first: ''}
		//Act & Assert
		await expect( quiz.getScore(obj, 'git') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('It should throw an error if the second key/value in the object contains an empty string', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		const obj = {first: 'user', surname: ''}
		//Act & Assert
		await expect( quiz.getScore(obj, 'git') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('if object contians undefined value it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		const obj = {first: undefined}
		//Act & Assert
		await expect( quiz.getScore(obj, 'git') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('It should throw an error if the second key/value in the object contains undefined', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		const obj = {first: 'user', surname: undefined}
		//Act & Assert
		await expect( quiz.getScore(obj, 'git') )
			.rejects.toEqual( Error('Missing Value') )
		done()
	})

	test('Should return 0% and fail', async done => {
		expect.assertions(2)
		//Arrange
		const quiz = await new Quiz()
		const obj = {'What is git?': 'github'}
		//Act
		const result = await quiz.getScore(obj, 'git')
		//Assert
		expect(result.score).toBe('0%')
		expect(result.outcome).toEqual('Fail')
		done()
	})

	test('Should return 10% and fail as percentage below 40% pass mark', async done => {
		expect.assertions(3)
		//Arrange
		const quiz = await new Quiz()
		const obj = {'What is git?': 'ans'}
		const data = {topic: 'git', question: 'What is git?', answer: 'ans', rand1: 'g1', rand2: 'g2', rand3: 'g3'}
		//Act & Assert
		await expect(quiz.setQuizQuestion(data) )
			.resolves.toBeTruthy()
		const result = await quiz.getScore(obj, 'git')
		expect(result.score).toBe('10%')
		expect(result.outcome).toBe('Fail')
		done()
	})

	test('Should return 20% and fail as percentage below 40% pass mark', async done => {
		expect.assertions(3)
		//Arrange
		const quiz = await new Quiz()
		const obj ={'q1?': 'a1', 'q2?': 'a2', 'q3?': 'a3', 'q4?': 'a4'}
		//Act & Assert
		let data = {topic: 'git', question: 'q1?', answer: 'a1', rand1: 'g1', rand2: 'g2', rand3: 'g3'}
		await quiz.setQuizQuestion(data)
		data = {topic: 'git', question: 'q2?', answer: 'a2', rand1: 'g1', rand2: 'g2', rand3: 'g3'}
		await quiz.setQuizQuestion(data)
		data = {topic: 'git', question: 'q3?', answer: 'a3', rand1: 'g1', rand2: 'g2', rand3: 'g3'}
		await quiz.setQuizQuestion(data)
		await expect(quiz.setQuizQuestion(data) )
			.resolves.toBeTruthy()
		const result = await quiz.getScore(obj, 'git')
		expect(result.score).toBe('20%')
		expect(result.outcome).toBe('Fail')
		done()
	})

	test('Should return 40% and pass', async done => {
		expect.assertions(2)
		//Arrange
		const quiz = await new Quiz()
		const obj ={'q1?': 'a1', 'q2?': 'a2', 'q3?': 'a3', 'q4?': 'a4'}
		//Act & Assert
		let data = {topic: 'git', question: 'q1?', answer: 'a1', rand1: 'g1', rand2: 'g2', rand3: 'g3'}
		await quiz.setQuizQuestion(data)
		data = {topic: 'git', question: 'q2?', answer: 'a2', rand1: 'g1', rand2: 'g2', rand3: 'g3'}
		await quiz.setQuizQuestion(data)
		data = {topic: 'git', question: 'q3?', answer: 'a3', rand1: 'g1', rand2: 'g2', rand3: 'g3'}
		await quiz.setQuizQuestion(data)
		data = {topic: 'git', question: 'q4?', answer: 'a4', rand1: 'g1', rand2: 'g2', rand3: 'g3'}
		await quiz.setQuizQuestion(data)
		const result = await quiz.getScore(obj, 'git')
		expect(result.score).toBe('40%')
		expect(result.outcome).toEqual('Pass')
		done()
	})
})

describe('setQuizResults()', () => {

	test('If user does exist it should return true', async done => {
		expect.assertions(2)
		//Arrange
		const accounts = await new Accounts()
		const quiz = await new Quiz()
		//Act & Assert
		await expect(accounts.register('admin', 'admin', 'admin', 'admin') )
			.resolves.toBeTruthy()
		await expect(quiz.setQuizResult('admin','git','50%', 'Pass'))
			.resolves.toBeTruthy()
		done()
	})

	test('If a parameter is not passed it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizResult() )
		  .rejects.toEqual( Error('Missing Value') )
		done()
	  })

	  test('If the first parameter contains an empty stirng it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizResult('','a','b','c') )
		  .rejects.toEqual( Error('Missing Value') )
		done()
	  })

	  test('If the second parameter contains an empty stirng it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizResult('a','','b','c') )
		  .rejects.toEqual( Error('Missing Value') )
		done()
	  })

	  test('If the third parameter contains an empty stirng it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizResult('a','b','','c') )
		  .rejects.toEqual( Error('Missing Value') )
		done()
	  })

	  test('If the fourth parameter contains an empty stirng it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizResult('a','b','c','') )
		  .rejects.toEqual( Error('Missing Value') )
		done()
	  })

	  test('If the first parameter contains undefined it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizResult(undefined,'b','c','d') )
		  .rejects.toEqual( Error('Missing Value') )
		done()
	  })

	  test('If the second parameter contains undefined it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizResult('a',undefined,'c','d') )
		  .rejects.toEqual( Error('Missing Value') )
		done()
	  })

	  test('If the third parameter contains undefined it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizResult('a','b',undefined,'d') )
		  .rejects.toEqual( Error('Missing Value') )
		done()
	  })

	  test('If the fourth parameter contains undefined it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.setQuizResult('a','b','c',undefined) )
		  .rejects.toEqual( Error('Missing Value') )
		done()
	  })
})

describe('getQuizResults()', () => {

	test('If user does exist it should return users past results', async done => {
		expect.assertions(3)
		//Arrange
		const accounts = await new Accounts()
		const quiz = await new Quiz()
		//Act & Assert
		await expect(accounts.register('admin', 'admin', 'admin', 'admin') )
			.resolves.toBeTruthy()
		await expect(quiz.setQuizResult('admin','git','50%', 'Pass'))
			.resolves.toBeTruthy()
		await expect( quiz.getQuizResult('admin') )
			.resolves.toEqual([{'id': 1, 'outcome': 'Pass', 'score': '50%', 'topic': 'git', 'user': 'admin'}])
		done()
	})

	test('If the user does exist it should pull users score', async done => {
		expect.assertions(3)
		//Arrange
		const accounts = await new Accounts()
		const quiz = await new Quiz()
		//Act & Assert
		await expect(accounts.register('user', 'user', 'user', 'user') )
			.resolves.toBeTruthy()
		await expect(quiz.setQuizResult('user','git','30%', 'Fail'))
			.resolves.toBeTruthy()
		await expect( quiz.getQuizResult('user') )
			.resolves.toEqual([{'id': 1, 'outcome': 'Fail', 'score': '30%', 'topic': 'git', 'user': 'user'}])
		done()
	})

	test('If a parameter is not passed it should throw error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.getQuizResult() )
		  .rejects.toEqual( Error('Missing Value') )
		done()
	  })

	  test('If a parameter passed is an empty string it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.getQuizResult('') )
		  .rejects.toEqual( Error('Missing Value') )
		done()
	  })

	  test('If a parameter passed contains undefined it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const quiz = await new Quiz()
		//Act & Assert
		await expect( quiz.getQuizResult('') )
		  .rejects.toEqual( Error('Missing Value') )
		done()
	  })
})
