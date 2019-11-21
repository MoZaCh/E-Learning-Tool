
'use strict'

const Accounts = require('../modules/user.js')

describe('checkCredentials()', () => {

	test('If empty object is passed it should throw an error', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const obj = {}
		await expect( account.checkCredentials(obj) )
			.rejects.toEqual( Error('Empty Object') )
		done()
	})

	test('if object is undefined it should throw an error', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.checkCredentials() )
			.rejects.toEqual( Error('Cannot convert undefined or null to object') )
		done()
	})
})

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const register = await account.register('doej', 'password', 'firstname', 'surname')
		expect(register).toBe(true)
		done()
	})

	test('register a username that already exists should throw an error', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'firstname', 'surname')
		await expect( account.register('doej', 'password', 'firstname', 'surname') )
			.rejects.toEqual( Error('username "doej" already in use') )
		done()
	})

	test('Should throw an error if username is blank', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('', 'password', 'firstname', 'surname') )
			.rejects.toEqual( Error('Missing Username') )
		done()
	})

	test('should throw an error if password is blank', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', '', 'firstname', 'surname') )
			.rejects.toEqual( Error('Missing Password') )
		done()
	})

	test('Should throw an error if firstname is blank', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', '', 'surname') )
			.rejects.toEqual( Error('Missing FirstName') )
		done()
	})

	test('Should throw an error if surname is blank', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', 'firstname', '') )
			.rejects.toEqual( Error('Missing Surname') )
		done()
	})

	test('Should throw an error if undefined', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password', 'firstname', undefined) )
			.rejects.toEqual( Error('Missing Surname') )
		done()
	})
})
