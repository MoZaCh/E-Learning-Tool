
'use strict'

const FrontEnd = require('../modules/front_end.js')

describe('convertToBase()', () => {

	test('Should return username and password in base64', async done => {
		expect.assertions(1)
		//Arrange
		const frontend = await new FrontEnd()
		const user = 'John'
		const pass = 'password'
		//Act & Assert
		await expect( frontend.convertToBase(user, pass) )
			.resolves.toEqual('Basic Sm9objpwYXNzd29yZA==')
		done()
	})

	test('Should return username and password in base64 attempt 2', async done => {
		expect.assertions(1)
		//Arrange
		const frontend = await new FrontEnd()
		const user = 'John'
		const pass = 'password'
		//Act & Assert
		await expect( frontend.convertToBase(user, pass) )
			.resolves.toEqual('Basic Sm9objpwYXNzd29yZA==')
		done()
	})

	test('Should return base64 of the two strings passed', async done => {
		expect.assertions(1)
		//Arrange
		const frontend = await new FrontEnd()
		const user = 'user'
		const pass = 'pass'
		//Act & Assert
		await expect( frontend.convertToBase(user, pass) )
			.resolves.toEqual('Basic dXNlcjpwYXNz')
		done()
	})
})

describe('convertToString()', () => {

	test('Should return an array of username and password decoded', async done => {
		expect.assertions(1)
		//Arrange
		const frontend = await new FrontEnd()
		const base64 = 'Basic Sm9objpwYXNzd29yZA=='
		//Act & Assert
		await expect( frontend.convertToString(base64) )
			.resolves.toEqual(['John', 'password'])
		done()
	})

	test('Should return an array of user detials decoded', async done => {
		expect.assertions(2)
		//Arrange
		const frontend = await new FrontEnd()
		const base64 = 'Basic Sm9objpwYXNzd29yZA=='
		//Act
		const data = await frontend.convertToString(base64)
		//Assert
		expect(data[0]).toEqual('John')
		expect(data[1]).toEqual('password')
		done()
	})
})

describe('makeObj()', () => {

	test('Should return an id from the object created', async done => {
		expect.assertions(1)
		//Arrange
		const frontend = await new FrontEnd()
		const data = {id: 'hello:bye'}
		//Act
		const result = await frontend.makeObj(data)
		expect(result.id).toEqual('hello')
		done()
	})

	test('Should return a topic from the object created', async done => {
		expect.assertions(1)
		//Arrange
		const frontend = await new FrontEnd()
		const data = {id: 'hello:bye'}
		//Act
		const result = await frontend.makeObj(data)
		//Assert
		expect(result.topic).toEqual('bye')
		done()
	})
})

