'use strict'

const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const shell = require('shelljs')
//const PuppeteerHar = require('puppeteer-har')

const width = 800
const height = 600
const delayMS = 5

let browser
let page
//let har

const toMatchImageSnapshot = configureToMatchImageSnapshot({
	customDiffConfig: { threshold: 2},
	noColors: true,
})
expect.extend({ toMatchImageSnapshot })

beforeAll( async() => {
	browser= await puppeteer.launch({headless: false, slowMo: delayMS, args: [`--window-size=${width},${height}`] })
	page = await browser.newPage()
	//har = new PuppeteerHar(page)
	await page.setViewport({ width, height})
	await shell.exec('acceptance_test/beforeAll.sh')

})

afterAll( async() => {
	browser.close()
	await shell.exec('acceptance_test/afterAll.sh')
})

describe('Registering', () => {

	// test('Register a user', async done => {
	// 	//await page.tracing.start({path: 'trace/registering_user_har.json',screenshots: true})
	// 	//await har.start({path: 'trace/registering_user_trace.har' })
	// 	//Arrange
	// 	await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load'})
	// 	//Act
	// 	await page.type('input[name=firstName]', 'c')
	// 	await page.type('input[name=surname]', 'c')
	// 	await page.type('input[name=user]', 'c')
	// 	await page.type('input[name=pass]', 'c')
	// 	await page.click('input[type=submit')

	// 	// await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load' })
	// 	// await page.type('input[name=user]', 'Zahed')
	// 	// await page.type('input[name=pass]', 'Hello')
	// 	// await page.click('input[type=submit')

	// 	await page.waitForSelector('p')
	// 	//Assert
	// 	expect( await page.evaluate( () => document.querySelector('p').innerText ) )
	// 		.toBe('new user c added')

	// 	const image = await page.screenshot()

	// 	expect(image).toMatchImageSnapshot()

	// 	//await page.tracing.stop()
	// 	//await har.stop()
	// 	done()
	// }, 16000)

	test('Should throw an error if all fields are left blank', async done => {
		//Arrange
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.click('input[type=submit')
		await page.waitForSelector('h2')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2').innerText ) )
			.toBe('Missing Username')

		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Should throw an error "Missing Username", if the username field is left blank', async done => {
		//Arrange
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load'})

		//Act
		await page.type('input[name=pass]', 'test')
		await page.type('input[name=firstName]', 'test')
		await page.type('input[name=surname]', 'test')
		await page.click('input[type=submit')
		await page.waitForSelector('h2')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2').innerText ) )
			.toBe('Missing Username')

		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Should throw an error "Missing Password", if the password field is left blank', async done => {
		//Arrange
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=user]', 'admin')
		await page.click('input[type=submit')
		await page.waitForSelector('h2')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2').innerText ) )
			.toBe('Missing Password')

		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Should throw an error "Missing Firstname", if the firstname field is left blank', async done => {
		//Arrange
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=user]', 'admin')
		await page.type('input[name=pass]', 'admin')
		await page.click('input[type=submit')
		await page.waitForSelector('h2')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2').innerText ) )
			.toBe('Missing FirstName')

		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Should throw an error "Missing Surname", if all surname field is left blank', async done => {
		//Arrange
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=user]', 'admin')
		await page.type('input[name=pass]', 'admin')
		await page.type('input[name=firstName]', 'admin')
		await page.click('input[type=submit')
		await page.waitForSelector('h2')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2').innerText ) )
			.toBe('Missing Surname')

		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Check that the goback button operates as it should', async done => {
		//Arrange
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=user]', 'admin')
		await page.type('input[name=pass]', 'admin')
		await page.type('input[name=firstName]', 'admin')
		await page.click('input[type=submit')
		await page.waitForSelector('h1')
		await page.click('button[name=goback]')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Create an Account')

		const image = await page.screenshot()
		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Should succesfully register new user', async done => {
		//Arrange
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=firstName]', 'admin')
		await page.type('input[name=surname]', 'admin')
		await page.type('input[name=user]', 'admin')
		await page.type('input[name=pass]', 'admin')
		await page.click('input[type=submit')

		await page.waitForSelector('p[id=message]')
		//Assert
		expect( await page.evaluate( () => document.querySelector('p[id=message]').innerText ) )
			.toBe('new user admin added')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Should throw an error if username already exists', async done => {
		//Arrange
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=firstName]', 'admin')
		await page.type('input[name=surname]', 'admin')
		await page.type('input[name=user]', 'admin')
		await page.type('input[name=pass]', 'admin')
		await page.click('input[type=submit')

		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('An Error Has Occurred')
		expect( await page.evaluate( () => document.querySelector('h2').innerText ) )
			.toBe('username "admin" already in use')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Register a user and allow user to login', async done => {
		//Arrange
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=firstName]', 'new')
		await page.type('input[name=surname]', 'new')
		await page.type('input[name=user]', 'new')
		await page.type('input[name=pass]', 'new')
		await page.click('input[type=submit')

		await page.waitForSelector('p[id=message]')
		expect( await page.evaluate( () => document.querySelector('p[id=message]').innerText ) )
			.toBe('new user new added')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)
})

describe('Login', () => {

	test('A registered user should be able to login', async done => {
		//Arrange
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=firstName]', 'Zahed')
		await page.type('input[name=surname]', 'Hello')
		await page.type('input[name=user]', 'Zahed')
		await page.type('input[name=pass]', 'Hello')
		await page.click('input[type=submit')

		await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load' })
		await page.type('input[name=user]', 'Zahed')
		await page.type('input[name=pass]', 'Hello')
		await page.click('input[type=submit')

		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Welcome Zahed')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('It should throw an error if the username does not exist', async done => {
		//Arrange
		await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=user]', 'newUser')
		await page.type('input[name=pass]', 'newUser')
		await page.click('input[type=submit')

		await page.waitForSelector('p[id=message]')
		//Assert
		expect( await page.evaluate( () => document.querySelector('p[id=message]').innerText ) )
			.toBe('username "newUser" not found')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('It should throw an error if incorrect password is used', async done => {
		//Arrange
		await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=user]', 'Zahed')
		await page.type('input[name=pass]', 'wrongpassword')
		await page.click('input[type=submit')

		await page.waitForSelector('p[id=message]')
		//Assert
		expect( await page.evaluate( () => document.querySelector('p[id=message]').innerText ) )
			.toBe('invalid password for account "Zahed"')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('It should throw an error if nothing is entered', async done => {
		//Arrange
		await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=user]', '')
		await page.type('input[name=pass]', '')
		await page.click('input[type=submit')

		await page.waitForSelector('p[id=message]')
		//Assert
		expect( await page.evaluate( () => document.querySelector('p[id=message]').innerText ) )
			.toBe('username "" not found')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('It should throw an error if a number is entered', async done => {
		//Arrange
		await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=user]', '0')
		await page.type('input[name=pass]', '')
		await page.click('input[type=submit')

		await page.waitForSelector('p[id=message]')
		//Assert
		expect( await page.evaluate( () => document.querySelector('p[id=message]').innerText ) )
			.toBe('username "0" not found')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)
})

describe('Homepage', () => {

	test('After a user has logged in the tile of the page should be E-Learning Homepage', async done => {
		//Arrange
		await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=user]', 'Zahed')
		await page.type('input[name=pass]', 'Hello')
		await page.click('input[type=submit')
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Welcome Zahed')

		await expect(page.title()).resolves.toMatch('E-Learning Homepage')


		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('After a user has logged in they should see Git as one of the topics', async done => {

		//Act
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Welcome Zahed')

		expect( await page.evaluate( () => document.querySelector('h3[id=git]').innerText ) )
			.toBe('Learn GIT')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('User should be able to navigate to the git page by clicking on the button', async done => {
		//Arrange
		// await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load'})
		// //Act
		await page.click('button[id=git]')
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Git')

		await expect(page.title()).resolves.toMatch('git')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('After a user has logged in they should see HTML as one of the topics', async done => {
		//Arrange
		await page.goto('http://localhost:8080/homepage', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Welcome Zahed')

		expect( await page.evaluate( () => document.querySelector('h3[id=html]').innerText ) )
			.toBe('Learn HTML5')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('User should be able to navigate to the html page by clicking on the button', async done => {
		//Arrange
		// await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load'})
		// //Act
		await page.click('button[id=html]')
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Html')

		await expect(page.title()).resolves.toMatch('html')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('After a user has logged in they should see CSS as one of the topics', async done => {
		//Arrange
		await page.goto('http://localhost:8080/homepage', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Welcome Zahed')

		expect( await page.evaluate( () => document.querySelector('h3[id=css]').innerText ) )
			.toBe('Learn CSS')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('User should be able to navigate to the css page by clicking on the button', async done => {
		//Arrange
		// await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load'})
		// //Act
		await page.click('button[id=css]')
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Css')

		await expect(page.title()).resolves.toMatch('css')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)
})

describe('GIT Page', () => {

	test('Git Content page 1 should be displayed with heading 1', async done => {
		//Arrange
		await page.goto('http://localhost:8080/homepage', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.click('button[id=git')
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Git')

		expect( await page.evaluate( () => document.querySelector('h2[id=heading1]').innerText ) )
			.toBe('What’s a version control system?')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Git Content page 1 should be displayed with heading 2', async done => {
		//Act
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Git')

		expect( await page.evaluate( () => document.querySelector('h2[id=heading2]').innerText ) )
			.toBe('What’s a distributed version control system?')

		expect( await page.evaluate( () => document.querySelector('h2[id=heading3]').innerText ) )
			.toBe('Why Git?')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Git Content page 1 should be displayed with heading 3', async done => {
		//Act
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Git')

		expect( await page.evaluate( () => document.querySelector('h2[id=heading3]').innerText ) )
			.toBe('Why Git?')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	// test('Git Content page 1 should be displayed to the user', async done => {
	// 	//Arrange
	// 	await page.goto('http://localhost:8080/homepage', { timeout: 30000, waitUntil: 'load'})
	// 	//Act
	// 	await page.click('button[id=git')
	// 	await page.waitForSelector('h1')
	// 	//Assert
	// 	expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
	// 		.toBe('Git')

	// 	expect( await page.evaluate( () => document.querySelector('h2[id=heading1]').innerText ) )
	// 		.toBe('What’s a version control system?')

	// 	expect( await page.evaluate( () => document.querySelector('h2[id=heading2]').innerText ) )
	// 		.toBe('What’s a distributed version control system?')

	// 	expect( await page.evaluate( () => document.querySelector('h2[id=heading3]').innerText ) )
	// 		.toBe('Why Git?')

	// 	const image = await page.screenshot()

	// 	expect(image).toMatchImageSnapshot()

	// 	done()
	// }, 16000)

	test('Git Content page 2 should be displayed with heading 1 when the next button is clicked', async done => {
		//Act
		await page.click('button[id=btnNext')
		await page.waitForSelector('h2[id=heading1]')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2[id=heading1]').innerText ) )
			.toBe('Basic Git commands')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Git Content page 2 should be displayed with heading 2', async done => {
		//Act
		await page.waitForSelector('h2[id=heading2]')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2[id=heading2]').innerText ) )
			.toBe('Git init, Git clone & Git add')

		expect( await page.evaluate( () => document.querySelector('h2[id=heading3]').innerText ) )
			.toBe('Git commit, git status & git branch')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Git Content page 2 should be displayed with heading 3', async done => {
		//Act
		await page.waitForSelector('h2[id=heading3]')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2[id=heading3]').innerText ) )
			.toBe('Git commit, git status & git branch')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('User should be able to click on the test my understanding link to take part in a quiz', async done => {
		//Act
		await page.click('button[id=quiz')
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Quiz')

		//Act
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.waitForSelector('h1')

		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Quiz Result')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)
})

describe('HTML Page', () => {

	test('Html Content page 1 should be displayed with heading 1', async done => {
		//Arrange
		await page.goto('http://localhost:8080/homepage', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.click('button[id=html')
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Html')

		expect( await page.evaluate( () => document.querySelector('h2[id=heading1]').innerText ) )
			.toBe('What is HTML?')

		expect( await page.evaluate( () => document.querySelector('h2[id=heading2]').innerText ) )
			.toBe('The History of HTML')

		expect( await page.evaluate( () => document.querySelector('h2[id=heading3]').innerText ) )
			.toBe('What are Tags and Attributes?')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Html Content page 1 should be displayed with heading 2', async done => {
		//Arrange
		await page.goto('http://localhost:8080/homepage', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.click('button[id=html')
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Html')

		expect( await page.evaluate( () => document.querySelector('h2[id=heading2]').innerText ) )
			.toBe('The History of HTML')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Html Content page 1 should be displayed with heading 3', async done => {
		//Arrange
		await page.goto('http://localhost:8080/homepage', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.click('button[id=html')
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Html')

		expect( await page.evaluate( () => document.querySelector('h2[id=heading3]').innerText ) )
			.toBe('What are Tags and Attributes?')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Html Content page 2 should be displayed with heading 1', async done => {
		//Act
		await page.click('button[id=btnNext')
		await page.waitForSelector('h2[id=heading1]')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2[id=heading1]').innerText ) )
			.toBe('What Are HTML Tags?')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Html Content page 2 should be displayed with heading 2', async done => {
		//Act
		await page.waitForSelector('h2[id=heading2]')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2[id=heading2]').innerText ) )
			.toBe('What are HTML Attributes?')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Html Content page 2 should be displayed with heading 3', async done => {
		//Act
		await page.waitForSelector('h2[id=heading3]')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2[id=heading3]').innerText ) )
			.toBe('Golden Rules To Remember')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('User should be able to click on the test my understanding link to take part in the html quiz', async done => {
		//Act
		await page.click('button[id=quiz')
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Quiz')

		//Act
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.waitForSelector('h1')

		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Quiz Result')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)
})

describe('CSS Page', () => {

	test('Css Content page 1 should be displayed with heading 1', async done => {
		//Arrange
		await page.goto('http://localhost:8080/homepage', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.click('button[id=css')
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Css')

		expect( await page.evaluate( () => document.querySelector('h2[id=heading1]').innerText ) )
			.toBe('Cascading Style Sheets')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Css Content page 1 should be displayed with heading 2', async done => {
		//Act
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2[id=heading2]').innerText ) )
			.toBe('Syntax')
		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('Css Content page 1 should be displayed with heading 3', async done => {
		//Act
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2[id=heading3]').innerText ) )
			.toBe('Declaration block')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)

	test('User should be able to click on the test my understanding link to take part in the', async done => {
		//Act
		await page.click('button[id=quiz')
		await page.waitForSelector('h1')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Quiz')

		//Act
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.click('button[id=nxtBtn]')
		await page.waitForSelector('h1')

		//Assert
		expect( await page.evaluate( () => document.querySelector('h1').innerText ) )
			.toBe('Quiz Result')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)
})
