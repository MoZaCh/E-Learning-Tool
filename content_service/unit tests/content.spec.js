
'use strict'

const Content = require('../modules/content.js' )

describe('getContent()', () => {

	test('It should get content from the database successfully', async done => {
		expect.assertions(3)
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
		await content.setContent(data)
		const result = await content.getContent('git', '1')
		expect(result.h1).toEqual('heading1')
		expect(data.h2).toEqual('heading2')
		expect(data.page).toEqual('1')
		done()
	})

	test('It should get content from the database successfull', async done => {
		expect.assertions(1)
		const content = await new Content()
		await expect(content.getContent('git', '1') )
			.rejects.toEqual( Error('No Content Available') )
		done()
	})
})
