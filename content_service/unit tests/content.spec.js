
'use strict'

const Content = require('../modules/content.js' )

describe('getContent()', () => {

	test('It should get content from the database successfully', async done => {
		expect.assertions(3)
		const content = await new Content()
		await content.setContent('git','h1','p1','h2','p2','h3','p3','1')
		const data = await content.getContent('git', '1')
		expect(data.h1).toEqual('h1')
		expect(data.h2).toEqual('h2')
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
