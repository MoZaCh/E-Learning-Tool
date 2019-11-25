
'use strict'

const Content = require('../modules/content.js' )

describe('getContent()', () => {

	test('Should retrieve content from the database successfully', async done => {
		expect.assertions(3)
		const content = await new Content()
		let data = {
			topic: 'git',
			h1: 'heading1',
			para1: 'paragraph1',
			h2: 'heading2',
			para2: 'paragraph2',
			h3: 'heading 3',
			para3: 'paragraph3',
			page: '1'
		}
		await content.setContent(data)
		data = {topic: 'git',
			page: '1'}
		const result = await content.getContent(data)
		expect(result.h1).toEqual('heading1')
		expect(result.h2).toEqual('heading2')
		expect(result.page).toEqual('1')
		done()
	})

	test('Should throw an error if no content is available', async done => {
		expect.assertions(1)
		const data = {topic: 'git', page: '1'}
		const content = await new Content()
		await expect(content.getContent(data) )
			.rejects.toEqual( Error('No Content Available') )
		done()
	})

	test('Should throw an error if no object is empty', async done => {
		expect.assertions(1)
		const data = {}
		const content = await new Content()
		await expect(content.getContent(data) )
			.rejects.toEqual( Error('Empty Object') )
		done()
	})

	test('Should throw an error if object contains an empty string value', async done => {
		expect.assertions(1)
		const data = {topic: ''}
		const content = await new Content()
		await expect(content.getContent(data) )
			.rejects.toEqual( Error('Missing parameters') )
		done()
	})

	test('Should throw an error if object contains a undefined value', async done => {
		expect.assertions(1)
		const data = {topic: undefined}
		const content = await new Content()
		await expect(content.getContent(data) )
			.rejects.toEqual( Error('Missing parameters') )
		done()
	})

	test('Should throw an error if undefined is passed instead of an object', async done => {
		expect.assertions(1)
		const content = await new Content()
		await expect(content.getContent(undefined) )
			.rejects.toEqual( Error('Cannot convert undefined or null to object') )
		done()
	})

	test('Should throw an error if null value is passed instead of object', async done => {
		expect.assertions(1)
		const content = await new Content()
		await expect(content.getContent(null) )
			.rejects.toEqual( Error('Cannot convert undefined or null to object') )
		done()
	})
})

describe('setContent()', () => {

	test('Should return true if database successfully updated', async done => {
		expect.assertions(1)
		const content = await new Content()
		const data = {
			topic: 'git',
			h1: 'heading1',
			para1: 'paragraph1',
			h2: 'heading2',
			para2: 'paragraph2',
			h3: 'heading 3',
			para3: 'paragraph3',
			page: '1'
		}
		await expect(content.setContent(data) )
			.resolves.toBeTruthy()
		done()
	})

	test('Should add content to the database successfully', async done => {
		expect.assertions()
		const content = await new Content()
		let data = {
			topic: 'git',
			h1: 'heading1',
			para1: 'paragraph1',
			h2: 'heading2',
			para2: 'paragraph2',
			h3: 'heading 3',
			para3: 'paragraph3',
			page: '1'
		}
		await expect(content.setContent(data) )
			.resolves.toBeTruthy()
		data = {topic: 'git', page: '1'}
		const result = await content.getContent(data)
		await expect(result.h1).toEqual('heading1')
		done()
	})

	test('Should succesfully get the paragraph newly set', async done => {
		expect.assertions(2)
		const content = await new Content()
		let data = {
			topic: 'git',
			h1: 'heading1',
			para1: 'paragraph1',
			h2: 'heading2',
			para2: 'paragraph2',
			h3: 'heading 3',
			para3: 'paragraph3',
			page: '1'
		}
		await expect(content.setContent(data) )
			.resolves.toBeTruthy()
		data = {topic: 'git', page: '1'}
		const result = await content.getContent(data)
		await expect(result.para1).toEqual('paragraph1')
		done()
	})

	test('Should throw an error if object is empty', async done => {
		expect.assertions(1)
		const content = await new Content()
		const data = {}
		await expect(content.setContent(data) )
			.rejects.toEqual( Error('Empty Object') )
		done()
	})

	test('Should throw an error if object is undefined', async done => {
		expect.assertions(1)
		const content = await new Content()
		const data = {undefined}
		await expect(content.setContent(data) )
			.rejects.toEqual( Error('Missing parameters') )
		done()
	})

	test('Should throw an error if object is an empty string', async done => {
		expect.assertions(1)
		const content = await new Content()
		const data = {'': ''}
		await expect(content.setContent(data) )
			.rejects.toEqual( Error('Missing parameters') )
		done()
	})
})
