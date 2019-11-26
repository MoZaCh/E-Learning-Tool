
'use strict'

const Content = require('../modules/content.js' )

describe('getContent()', () => {

	test('Should retrieve content from the database successfully', async done => {
		expect.assertions(3)
		//Arrange
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
		//Act
		await content.setContent(data)
		data = {topic: 'git',
			page: '1'}
		const result = await content.getContent(data)
		//Assert
		expect(result.h1).toEqual('heading1')
		expect(result.h2).toEqual('heading2')
		expect(result.page).toEqual('1')
		done()
	})

	test('Should throw an error if no content is available', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: 'git', page: '1'}
		const content = await new Content()
		//Act & Assert
		await expect(content.getContent(data) )
			.rejects.toEqual( Error('No Content Available') )
		done()
	})

	test('Should throw an error if no object is empty', async done => {
		expect.assertions(1)
		//Arrange
		const data = {}
		const content = await new Content()
		//Act & Assert
		await expect(content.getContent(data) )
			.rejects.toEqual( Error('Empty Object') )
		done()
	})

	test('Should throw an error if object contains an empty string value', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: ''}
		const content = await new Content()
		//Act & Assert
		await expect(content.getContent(data) )
			.rejects.toEqual( Error('Missing parameters') )
		done()
	})

	test('Should throw an error if object contains a undefined value', async done => {
		expect.assertions(1)
		//Arrange
		const data = {topic: undefined}
		const content = await new Content()
		//Act & Assert
		await expect(content.getContent(data) )
			.rejects.toEqual( Error('Missing parameters') )
		done()
	})

	test('Should throw an error if undefined is passed instead of an object', async done => {
		expect.assertions(1)
		//Arrange
		const content = await new Content()
		//Act & Assert
		await expect(content.getContent(undefined) )
			.rejects.toEqual( Error('Cannot convert undefined or null to object') )
		done()
	})

	test('Should throw an error if null value is passed instead of object', async done => {
		expect.assertions(1)
		//Arrange
		const content = await new Content()
		//Act & Assert
		await expect(content.getContent(null) )
			.rejects.toEqual( Error('Cannot convert undefined or null to object') )
		done()
	})
})

describe('setContent()', () => {

	test('Should return true if database successfully updated', async done => {
		expect.assertions(1)
		//Arrange
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
		//Act & Assert
		await expect(content.setContent(data) )
			.resolves.toBeTruthy()
		done()
	})

	test('Should add content to the database successfully', async done => {
		expect.assertions()
		//Arrange
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
		//Act & Assert
		await expect(content.setContent(data) )
			.resolves.toBeTruthy()
		data = {topic: 'git', page: '1'}
		const result = await content.getContent(data)
		await expect(result.h1).toEqual('heading1')
		done()
	})

	test('Should succesfully get the paragraph newly set', async done => {
		expect.assertions(2)
		//Arrange
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
		//Act & Assert
		await expect(content.setContent(data) )
			.resolves.toBeTruthy()
		data = {topic: 'git', page: '1'}
		const result = await content.getContent(data)
		await expect(result.para1).toEqual('paragraph1')
		done()
	})

	test('Should throw an error if object is empty', async done => {
		expect.assertions(1)
		//Arrange
		const content = await new Content()
		const data = {}
		//Act & Assert
		await expect(content.setContent(data) )
			.rejects.toThrow(new Error('SQLITE_ERROR: no such table: undefined') )
		done()
	})

	test('Should throw an error if object is undefined', async done => {
		expect.assertions(1)
		//Arrange
		const content = await new Content()
		const data = {undefined}
		//Act & Assert
		await expect(content.setContent(data) )
			.rejects.toThrow(new Error('SQLITE_ERROR: no such table: undefined') )
		done()
	})

	test('Should throw an error if object is an empty string', async done => {
		expect.assertions(1)
		//Arrange
		const content = await new Content()
		const data = {'': ''}
		//Act & Assert
		await expect(content.setContent(data) )
			.rejects.toThrow(new Error('SQLITE_ERROR: no such table: undefined') )

		done()
	})
})

describe('updateContent()', () => {

	test('Should update content successfully and return true', async done => {
		expect.assertions(1)
		//Arrange
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
		//Act & Assert
		await expect(content.updateContent(data) )
			.resolves.toBeTruthy()
		done()
	})

	test('Should check the object before updating the database', async done => {
		expect.assertions(1)
		//Arrange
		const content = await new Content()
		const data = {
			topic: 'git',
			h1: '',
			para1: 'paragraph1',
			h2: 'heading2',
			para2: 'paragraph2',
			h3: 'heading 3',
			para3: 'paragraph3',
			page: '1'
		}
		//Act & Assert
		await expect(content.updateContent(data) )
			.resolves.toBeTruthy()
		done()
	})
})

describe('viewContent()', () => {

	test('Should retreive the correct record based on id and topic', async done => {
		expect.assertions(2)
		//Arrange
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
		//Act & Assert
		await expect(content.setContent(data) )
			.resolves.toBeTruthy()
		data = {
			topic: 'git',
			id: '1'
		}
		await expect(content.viewContent(data) )
			.resolves.toBeTruthy()
		done()
	})

	test('Should throw an error if no content exists', async done => {
		expect.assertions(1)
		//Arrange
		const content = await new Content()
		const data = {
			topic: 'git',
			id: '1'
		}
		//Act & Assert
		await expect(content.viewContent(data) )
			.rejects.toEqual( Error('No Content Available'))
		done()
	})
})

describe('getAllContent()', () => {

	test('Should return all the content form all 3 databases', async done => {
		expect.assertions(6)
		//Arrange
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
		//Act & Assert
		await expect(content.setContent(data) )
			.resolves.toBeTruthy()
		data = {
			topic: 'css',
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
		data = {
			topic: 'html',
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
		const result = await content.getAllContent()
		await expect(result[0].topic).toEqual('git')
		await expect(result[1].topic).toEqual('html')
		await expect(result[2].topic).toEqual('css')
		done()
	})

	test('Should throw an error if the tables are empty', async done => {
		expect.assertions(1)
		//Arrange
		const content = await new Content()
		//Act & Assert
		await expect(content.getAllContent() )
			.rejects.toEqual( Error('No Content Available') )
		done()
	})
})

describe('getContent()', () => {

	test('Should return content for a specific topic and page', async done => {
		expect.assertions(7)
		//Arrange
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
		//Act & Assert
		await expect(content.setContent(data) )
			.resolves.toBeTruthy()
		data = {
			topic: 'git',
			h1: 'heading1',
			para1: 'paragraph1',
			h2: 'heading2',
			para2: 'paragraph2',
			h3: 'heading 3',
			para3: 'paragraph3',
			page: '2'
		}
		//Act & Assert
		await expect(content.setContent(data) )
			.resolves.toBeTruthy()
		data = {
			topic: 'css',
			h1: 'heading1',
			para1: 'paragraph1',
			h2: 'heading2',
			para2: 'paragraph2',
			h3: 'heading 3',
			para3: 'paragraph3',
			page: '1'
		}
		//Act & Assert
		await expect(content.setContent(data) )
			.resolves.toBeTruthy()
		data = {
			topic: 'html',
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
		await expect(content.setImg('git', 'img1', 'img2'))
			.resolves.toBeTruthy()
		data = {topic: 'git', page: '1'}
		const result = await content.getContent(data)
		await expect(result.topic).toEqual('git')
		await expect(result.page).toEqual('1')
		done()
	})

	test('Should return content for a specific topic and page without any images', async done => {
		expect.assertions(7)
		//Arrange
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
		//Act & Assert
		await expect(content.setContent(data) )
			.resolves.toBeTruthy()
		data = {
			topic: 'git',
			h1: 'heading1',
			para1: 'paragraph1',
			h2: 'heading2',
			para2: 'paragraph2',
			h3: 'heading 3',
			para3: 'paragraph3',
			page: '2'
		}
		await expect(content.setContent(data) )
			.resolves.toBeTruthy()
		data = {
			topic: 'css',
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
		data = {
			topic: 'html',
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
		await expect(content.setImg('git', 'img1', ''))
			.resolves.toBeTruthy()
		data = {topic: 'git', page: '1'}
		const result = await content.getContent(data)
		await expect(result.topic).toEqual('git')
		await expect(result.page).toEqual('1')
		done()
	})
})
