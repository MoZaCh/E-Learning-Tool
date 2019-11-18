
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
