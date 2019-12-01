
'use strict'

const Accounts = require('../modules/user.js')

describe('checkCredentials()', () => {

	test('If empty object is passed it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		const obj = {}
		//Act & Assert
		await expect( account.checkCredentials(obj) )
			.rejects.toEqual( Error('Empty Object') )
		done()
	})

	test('If an object contains an empty value it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		const obj = {name: ''}
		//Act & Assert
		await expect( account.checkCredentials(obj) )
			.rejects.toEqual( Error('Missing name') )
		done()
	})

	test('If an object contains an undefined value it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		const obj = {name: undefined}
		//Act & Assert
		await expect( account.checkCredentials(obj) )
			.rejects.toEqual( Error('Missing name') )
		done()
	})

	test('If the second key in the object contains an undefined value it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		const obj = {name: 'hello', surname: undefined }
		//Act & Assert
		await expect( account.checkCredentials(obj) )
			.rejects.toEqual( Error('Missing surname') )
		done()
	})

	test('if object is undefined it should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Asserts
		await expect( account.checkCredentials() )
			.rejects.toEqual( Error('Cannot convert undefined or null to object') )
		done()
	})

	test('Should do nothing if object sucessfully passed', async done => {
		expect.assertions(0)
		//Arrange
		const data = {name: 'test', surname: 'surname'}
		const account = await new Accounts()
		//Act & Asserts
		await expect( account.checkCredentials(data) )
			.resolves
		done()
	})

	test('Should not return null if object is empty', async done => {
		expect.assertions(1)
		//Arrange
		const data = {}
		const account = await new Accounts()
		//Act & Asserts
		await expect( account.checkCredentials(data) )
			.rejects.not.toBe(null)
		done()
	})

	test('Should not return undefined if object is empty', async done => {
		expect.assertions(1)
		//Arrange
		const data = {}
		const account = await new Accounts()
		//Act & Asserts
		await expect( account.checkCredentials(data) )
			.rejects.not.toBe(undefined)
		done()
	})
})

describe('register()', () => {

	test('Should return true if a user has been successfully registered', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		const register = await account.register('doej', 'password', 'firstname', 'surname')
		//Assert
		expect(register).toBe(true)
		done()
	})

	test('Trying to register a username that already exists should throw an error', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('doej', 'password', 'firstname', 'surname')
		//Act & Assert
		await expect( account.register('doej', 'password', 'firstname', 'surname') )
			.rejects.toEqual( Error('username "doej" already in use') )
		done()
	})

	test('Should throw an error if username is left blank', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.register('', 'password', 'firstname', 'surname') )
			.rejects.toEqual( Error('Missing Username') )
		done()
	})

	test('Should throw an error if password is left blank', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.register('doej', '', 'firstname', 'surname') )
			.rejects.toEqual( Error('Missing Password') )
		done()
	})

	test('Should throw an error if firstname is left blank', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.register('doej', 'password', '', 'surname') )
			.rejects.toEqual( Error('Missing FirstName') )
		done()
	})

	test('Should throw an error if surname is left blank', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.register('doej', 'password', 'firstname', '') )
			.rejects.toEqual( Error('Missing Surname') )
		done()
	})

	test('Should throw an error if username is undefined', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.register(undefined, 'password', 'firstname', 'surname') )
			.rejects.toEqual( Error('Missing Username') )
		done()
	})

	test('Should throw an error if password is undefined', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.register('username', undefined, 'firstname', 'surname') )
			.rejects.toEqual( Error('Missing Password') )
		done()
	})

	test('Should throw an error if firstname is undefined', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.register('username', 'password', undefined, 'surname') )
			.rejects.toEqual( Error('Missing FirstName') )
		done()
	})

	test('Should throw an error if surname is undefined', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.register('doej', 'password', 'firstname', undefined) )
			.rejects.toEqual( Error('Missing Surname') )
		done()
	})
})

describe('login()', () => {
	test('Should return true if valid credentials are used to login', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('doej', 'password', 'firstname', 'surname')
		const valid = await account.login('doej', 'password')
		//Assert
		expect(valid).toBe(true)
		done()
	})

	test('Should throw an error if invalid username is used', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('doej', 'password', 'firstname', 'surname')
		//Assert
		await expect( account.login('roej', 'password') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('Should throw an error if invalid password is used', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('doej', 'password', 'firstname', 'surname')
		//Assert
		await expect( account.login('doej', 'bad') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

	test('Should throw an error if username is left empty', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.login('','pass') )
			.rejects.toEqual( Error('username "" not found') )
		done()
	})

	test('Should throw an error if password is left empty', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.login('username','') )
			.rejects.toEqual( Error('username "username" not found') )
		done()
	})

	test('Should throw an error if username and password are left blank', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.login() )
			.rejects.toEqual( Error('username "undefined" not found') )
		done()
	})

	test('Should throw an error if no password is passed', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('doej', 'password', 'firstname', 'surname')
		//Assert
		await expect( account.login('doej','') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

	test('Should throw an error if no password is passed as a parameter', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('doej', 'password', 'firstname', 'surname')
		//Assert
		await expect( account.login('doej') )
			.rejects.toEqual( Error('data and hash arguments required') )
		done()
	})

	test('Should not return null if empty usernmae is passed', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.login('', 'password') )
			.rejects.not.toBe(null)
		done()
	})

	test('Should not return undefined if empty username is passed', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.login('', 'password') )
			.rejects.not.toBe(undefined)
		done()
	})

	test('Should not return null if empty password is passed', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.login('doej', '') )
			.rejects.not.toBe(undefined)
		done()
	})

	test('Should not return undefined if empty password is passed', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.login('doej', '') )
			.rejects.not.toBe(undefined)
		done()
	})
})

describe('userDetails()', () => {
	test('Should return the first name of a specific user using username', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		const user = await account.userDetails('Zahed96')
		//Assert
		expect(user.firstName).toEqual('Zahed')
		done()
	})

	test('Should return the surname of a specific user using username', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		const user = await account.userDetails('Zahed96')
		//Assert
		expect(user.surname).toEqual('Choudhury')
		done()
	})

	test('Should throw an error if username does not exist', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.userDetails() )
			.rejects.toEqual( Error('"undefined" does not exist') )
		done()
	})

	test('Should return true if username matches a record in the database', async done => {
		expect.assertions(3)
		//Arrange
		const ctn = {user: 'test', pass: 'testpass', firstName: 'test', surname: 'testsurname'}
		const account = await new Accounts()
		//Act & Assert
		await expect( account.createAdmin(ctn) )
			.resolves.toBeTruthy()
		const data = await account.userDetails('test')
		//Assert
		expect(data.type).toEqual('admin')
		expect(data.isAdmin).toBe(true)
		done()
	})

	test('Should return the complete user profile', async done => {
		expect.assertions(5)
		//Arrange
		const ctn = {user: 'test', pass: 'testpass', firstName: 'test', surname: 'testsurname'}
		const account = await new Accounts()
		//Act & Assert
		await expect( account.createAdmin(ctn) )
			.resolves.toBeTruthy()
		const data = await account.userDetails('test')
		//Assert
		expect(data.firstName).toEqual('test')
		expect(data.surname).toEqual('testsurname')
		expect(data.type).toEqual('admin')
		expect(data.isAdmin).toBe(true)
		done()
	})

	test('Should return the complete user profile of a newly added admin', async done => {
		expect.assertions(5)
		//Arrange
		const ctn = {user: 'newAdmin', pass: 'newAdmin', firstName: 'newAdmin', surname: 'newAdmin'}
		const account = await new Accounts()
		//Act & Assert
		await expect( account.createAdmin(ctn) )
			.resolves.toBeTruthy()
		const data = await account.userDetails('newAdmin')
		//Assert
		expect(data.firstName).toEqual('newAdmin')
		expect(data.surname).toEqual('newAdmin')
		expect(data.type).toEqual('admin')
		expect(data.isAdmin).toBe(true)
		done()
	})

	test('Should throw an error if user is not an admin or does not exist', async done => {
		expect.assertions(2)
		//Arrange
		const ctn = {user: 'hello', pass: 'testpass', firstName: 'test', surname: 'testsurname'}
		const account = await new Accounts()
		//Act & Assert
		await expect( account.createAdmin(ctn) )
			.resolves.toBeTruthy()
		await expect( account.userDetails('test') )
			.rejects.toEqual( Error('"test" does not exist') )
		//Assert
		done()
	})

	test('Should throw an error if integer 0 is passed', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.userDetails(0) )
			.rejects.toEqual( Error('"0" does not exist') )
		//Assert
		done()
	})

	test('Should throw an error if integer 1 is passed', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.userDetails(1) )
			.rejects.toEqual( Error('"1" does not exist') )
		//Assert
		done()
	})

	test('Should throw an error if integer -1 is passed', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.userDetails(-1) )
			.rejects.toEqual( Error('"-1" does not exist') )
		//Assert
		done()
	})

	test('Should throw an error if 0.0 is passed', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.userDetails(0.0) )
			.rejects.toEqual( Error('"0" does not exist') )
		//Assert
		done()
	})

	test('Should not return null if something is passed', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.userDetails('doej') )
			.rejects.not.toBe(null)
		//Assert
		done()
	})

	test('Should not return undefined if something is passed', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect( account.userDetails('doej') )
			.rejects.not.toBe(undefined)
		//Assert
		done()
	})
})

describe('updateDetails()', () => {
	test('Should return true, when the updateDetails is sucessful', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('doej', 'password', 'firstname', 'surname')
		const valid = await account.updateDetails('doej', 'Hello','Bye')
		//Assert
		expect(valid).toBe(true)
		done()
	})

	test('Should thorw an error if username does not exitst in the table', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect(account.updateDetails('doej', 'Hello','Bye'))
			.rejects.toEqual( Error('"doej" does not exist') )
		done()
	})

	test('Should return the updated firstname of a user', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		await account.updateDetails('Zahed96', 'Mohammed','Choudhury')
		const user = await account.userDetails('Zahed96')
		//Assert
		expect(user.firstName).toEqual('Mohammed')
		done()
	})

	test('Should return the updated surname of a user', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		await account.updateDetails('Zahed96', 'Zahed','Chow')
		//Assert
		const user = await account.userDetails('Zahed96')
		expect(user.surname).toEqual('Chow')
		done()
	})

	test('Should return the updated firstname and surname of a user', async done => {
		expect.assertions(2)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		await account.updateDetails('Zahed96', 'newfirstname','newsurname')
		const user = await account.userDetails('Zahed96')
		//Assert
		expect(user.firstName).toEqual('newfirstname')
		expect(user.surname).toEqual('newsurname')
		done()
	})

	test('Should throw an error if empty string is passed', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect(account.updateDetails(''))
			.rejects.toEqual( Error('"" does not exist') )
		done()
	})

	test('Should throw an error if undefined passed as a parameter', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect(account.updateDetails(undefined))
			.rejects.toEqual( Error('"undefined" does not exist') )
		done()
	})

	test('Should throw an error if integer 0 is passed as a parameter', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect(account.updateDetails(0))
			.rejects.toEqual( Error('"0" does not exist') )
		done()
	})

	test('Should throw an error if integer 1 is passed as a parameter', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect(account.updateDetails(1))
			.rejects.toEqual( Error('"1" does not exist') )
		done()
	})

	test('Should throw an error if integer -1 is passed as a parameter', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect(account.updateDetails(-1))
			.rejects.toEqual( Error('"-1" does not exist') )
		done()
	})

	test('Should throw an error if 0.0 is passed as a parameter', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect(account.updateDetails(0.0))
			.rejects.toEqual( Error('"0" does not exist') )
		done()
	})

	test('Should not return null if something does not exist', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect(account.updateDetails('doej'))
			.rejects.not.toBe(null)
		done()
	})

	test('Should not return undefined if something does not exist', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect(account.updateDetails('doej'))
			.rejects.not.toBe(undefined)
		done()
	})
})

describe('deleteUser()', () => {
	test('Should return true if user has been succesfully deleted', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		const user = await account.deleteUser('Zahed96')
		//Assert
		expect(user).toBe(true)
		done()
	})

	test('Should throw an error if user does not exist', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		await expect(account.deleteUser('Zahed968'))
			.rejects.toEqual( Error('"Zahed968" does not exist') )
		done()
	})

	test('Should throw an error if nothing is passed ', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		await expect(account.deleteUser(''))
			.rejects.toEqual( Error('"" does not exist') )
		done()
	})

	test('Should throw an error if undefined is passed ', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		await expect(account.deleteUser(undefined))
			.rejects.toEqual( Error('"undefined" does not exist') )
		done()
	})

	test('Should throw an error if a zero is passed ', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect(account.deleteUser(0))
			.rejects.toEqual( Error('"0" does not exist') )
		done()
	})

	test('Should throw an error if an integer is passed ', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect(account.deleteUser(1))
			.rejects.toEqual( Error('"1" does not exist') )
		done()
	})

	test('Should throw an error if a negative integer is passed ', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect(account.deleteUser(-1))
			.rejects.toEqual( Error('"-1" does not exist') )
		done()
	})

	test('Should throw an error if 0.0 is passed ', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act & Assert
		await expect(account.deleteUser(0.0))
			.rejects.toEqual( Error('"0" does not exist') )
		done()
	})
})

describe('checkUser()', () => {
	test('Should return true if user exists', async done => {
		expect.assertions(1)
		//Arrange
		const account = await new Accounts()
		//Act
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		const user = await account.checkUser('Zahed96')
		//Assert
		expect(user).toBe(true)
		done()
	})

	test('Should throw an error if empty parametes are passed', async done => {
		expect.assertions(1)
		//Act
		const account = await new Accounts()
		//Arrange & Assert
		await expect(account.checkUser(''))
			.rejects.toEqual( Error('username "" not found') )
		done()
	})

	test('Should throw an error if undefined passed', async done => {
		expect.assertions(1)
		//Act
		const account = await new Accounts()
		//Arrange & Assert
		await expect(account.checkUser(undefined))
			.rejects.toEqual( Error('username "undefined" not found') )
		done()
	})

	test('Should throw an error if the username does not exist', async done => {
		expect.assertions(1)
		//Act
		const account = await new Accounts()
		//Arrange & Assert
		await account.register('Zahed96', 'password', 'Zahed', 'Choudhury')
		await expect(account.checkUser('Zahed968'))
			.rejects.toEqual( Error('username "Zahed968" not found') )
		done()
	})

	test('Should throw an error if an integer is passed', async done => {
		expect.assertions(1)
		//Act
		const account = await new Accounts()
		//Arrange & Assert
		await expect(account.checkUser(1))
			.rejects.toEqual( Error('username "1" not found') )
		done()
	})

	test('Should throw an error if a negative integer is passed', async done => {
		expect.assertions(1)
		//Act
		const account = await new Accounts()
		//Arrange & Assert
		await expect(account.checkUser(-1))
			.rejects.toEqual( Error('username "-1" not found') )
		done()
	})

	test('Should throw an error if 0.0 is passed as username', async done => {
		expect.assertions(1)
		//Act
		const account = await new Accounts()
		//Arrange & Assert
		await expect(account.checkUser(0.0))
			.rejects.toEqual( Error('username "0" not found') )
		done()
	})

	test('Should not return null if a parameter is passed', async done => {
		expect.assertions(1)
		//Act
		const account = await new Accounts()
		//Arrange & Assert
		await expect(account.checkUser('doej'))
			.rejects.not.toBe(null)
		done()
	})

	test('Should not return undefined if a parameter is passed', async done => {
		expect.assertions(1)
		//Act
		const account = await new Accounts()
		//Arrange & Assert
		await expect(account.checkUser('doej'))
			.rejects.not.toBe(undefined)
		done()
	})
})
