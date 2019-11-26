'use strict'

const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
//const PuppeteerHar = require('puppeteer-har')

const width = 800
const height = 600
const delayMS = 20

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
})

afterAll( () => browser.close() )

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
		//await page.tracing.start({path: 'trace/registering_user_har.json',screenshots: true})
		//await har.start({path: 'trace/registering_user_trace.har' })
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

		//await page.tracing.stop()
		//await har.stop()
		done()
	}, 16000)

	test('Should throw an error "Missing Password", if only the username field has been populated', async done => {
		//await page.tracing.start({path: 'trace/registering_user_har.json',screenshots: true})
		//await har.start({path: 'trace/registering_user_trace.har' })
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

		//await page.tracing.stop()
		//await har.stop()
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
})
