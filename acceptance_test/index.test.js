'use strict'

const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const shell = require('shelljs')
//const PuppeteerHar = require('puppeteer-har')

const width = 800
const height = 600
const delayMS = 30

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

	test('Should throw an error is username already exists', async done => {
		//await page.tracing.start({path: 'trace/registering_user_har.json',screenshots: true})
		//await har.start({path: 'trace/registering_user_trace.har' })
		//Arrange
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=firstName]', 'admin')
		await page.type('input[name=surname]', 'admin')
		await page.type('input[name=user]', 'admin')
		await page.type('input[name=pass]', 'admin')
		await page.click('input[type=submit')

		// await page.goto('http://localhost:8080/login', { timeout: 30000, waitUntil: 'load' })
		// await page.type('input[name=user]', 'Zahed')
		// await page.type('input[name=pass]', 'Hello')
		// await page.click('input[type=submit')

		await page.waitForSelector('h2')
		//Assert
		expect( await page.evaluate( () => document.querySelector('h2').innerText ) )
			.toBe('username "admin" already in use')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		//await page.tracing.stop()
		//await har.stop()
		done()
	}, 16000)

	test('Register a user and login', async done => {
		//Arrange
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load'})
		//Act
		await page.type('input[name=firstName]', 'new')
		await page.type('input[name=surname]', 'new')
		await page.type('input[name=user]', 'new')
		await page.type('input[name=pass]', 'new')
		await page.click('input[type=submit')

		await page.waitForSelector('h2')
		expect( await page.evaluate( () => document.querySelector('h2').innerText ) )
			.toBe('username "new" already in use')

		const image = await page.screenshot()

		expect(image).toMatchImageSnapshot()

		done()
	}, 16000)
})

describe('Login', () => {

	test('A registered user should be able to login', async done => {
		//await page.tracing.start({path: 'trace/registering_user_har.json',screenshots: true})
		//await har.start({path: 'trace/registering_user_trace.har' })
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

		//await page.tracing.stop()
		//await har.stop()
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

		//await page.tracing.stop()
		//await har.stop()
		done()
	}, 16000)
})
