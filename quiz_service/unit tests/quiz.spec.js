
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
