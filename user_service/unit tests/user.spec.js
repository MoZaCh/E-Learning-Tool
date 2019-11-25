
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

describe('uploadPicture()', () => {
	// this would have to be done by mocking the file system
	// perhaps using mock-fs?
})

describe('login()', () => {
	test('Should return true if valid credentials are used to login', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'firstname', 'surname')
		const valid = await account.login('doej', 'password')
		expect(valid).toBe(true)
		done()
	})

	test('Should throw an error if invalid username is used', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'firstname', 'surname')
		await expect( account.login('roej', 'password') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('Should throw an error if invalid password is used', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'firstname', 'surname')
		await expect( account.login('doej', 'bad') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

	test('Should throw an error if username is left empty', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.login('','pass') )
			.rejects.toEqual( Error('username "" not found') )
		done()
	})

	test('Should throw an error if username and passwrod are left blank', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.login() )
			.rejects.toEqual( Error('username "undefined" not found') )
		done()
	})

	test('Should throw an error if password is left empty', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'firstname', 'surname')
		await expect( account.login('doej','') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

	test('Should throw an error if password is left blank', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'firstname', 'surname')
		await expect( account.login('doej') )
			.rejects.toEqual( Error('data and hash arguments required') )
		done()
	})
})

describe('userDetails()', () => {
	test('Should return the first name of a specific user using username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		const user = await account.userDetails('Zahed96')
		expect(user.firstName).toEqual('Zahed')
		done()
	})

	test('Should return the surname of a specific user using username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		const user = await account.userDetails('Zahed96')
		expect(user.surname).toEqual('Choudhury')
		done()
	})

	test('Should throw an error if username does not exist', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.userDetails() )
			.rejects.toEqual( Error('"undefined" does not exist') )
		done()
	})

	test('Shou', async done => {
		expect.assertions(2)
		const ctn = {user: 'test', pass: 'testpass', firstName: 'test', surname: 'testsurname'}
		const account = await new Accounts()
		await expect( account.createAdmin(ctn) )
			.resolves.toBeTruthy()
		const data = await account.userDetails('test')
		expect(data.type).toEqual('admin')
		done()
	})
})

describe('updateDetails()', () => {
	test('Should return true, when the updateDetails is sucessful', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password', 'firstname', 'surname')
		const valid = await account.updateDetails('doej', 'Hello','Bye')
		expect(valid).toBe(true)
		done()
	})

	test('Should thorw an error if username does not exitst in the table', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect(account.updateDetails('doej', 'Hello','Bye'))
			.rejects.toEqual( Error('"doej" does not exist') )
		done()
	})

	test('Should return the updated firstname of a user', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		await account.updateDetails('Zahed96', 'Mohammed','Choudhury')
		const user = await account.userDetails('Zahed96')
		expect(user.firstName).toEqual('Mohammed')
		done()
	})

	test('Should return the updated surname of a user', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		await account.updateDetails('Zahed96', 'Zahed','Chow')
		const user = await account.userDetails('Zahed96')
		expect(user.surname).toEqual('Chow')
		done()
	})

	test('Should return the updated firstname and surname of a user', async done => {
		expect.assertions(2)
		const account = await new Accounts()
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		await account.updateDetails('Zahed96', 'newfirstname','newsurname')
		const user = await account.userDetails('Zahed96')
		expect(user.firstName).toEqual('newfirstname')
		expect(user.surname).toEqual('newsurname')
		done()
	})

	describe('deleteUser()', () => {
		test('Should return true if user has been succesfully deleted', async done => {
			expect.assertions(1)
			const account = await new Accounts()
			await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
			const user = await account.deleteUser('Zahed96')
			expect(user).toBe(true)
			done()
		})

		test('Should throw an error if user does not exist', async done => {
			expect.assertions(1)
			const account = await new Accounts()
			await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
			await expect(account.deleteUser('Zahed968'))
				.rejects.toEqual( Error('"Zahed968" does not exist') )
			done()
		})
	})

	describe('checkUser()', () => {
		test('Should return true if user exists', async done => {
			expect.assertions(1)
			const account = await new Accounts()
			await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
			const user = await account.checkUser('Zahed96')
			expect(user).toBe(true)
			done()
		})

		test('Should throw an error if the username does not exist', async done => {
			expect.assertions(1)
			const account = await new Accounts()
			await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
			await expect(account.checkUser('Zahed968'))
				.rejects.toEqual( Error('username "Zahed968" not found') )
			done()
		})
	})
})
