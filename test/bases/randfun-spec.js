/* eslint-disable no-unused-expressions, no-invalid-this */
'use strict';
process.env.NODE_ENV === 'test'; // eslint-disable-line no-process-env

const { Client } = require('discord.js-commando');
const RandFunCommand = require('../../src/bases/randfun');
const cleanReply = require('../../src/modules/clean-reply');
const request = require('request-promise');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

describe('RandFunCommand', () => {
	let sb;

	before(() => {
		sb = sinon.sandbox.create();
	});

	beforeEach(() => {
		const client = new Client({ commandPrefix: '~' });
		sb.message = {
			content: '~randfun bar',
			cleanContent: '~randfun bar',
			client: client,
			channel: { type: 'text' }
		};
		const command = {
			name: 'randfun',
			group: 'fun',
			memberName: 'randfun',
			description: 'foo'
		};
		sb.randFun = new RandFunCommand(client, command, 'foo', 'http://i.imgur.com/foo.gif');
	});

	afterEach(() => sb.restore());

	it('should return "a.png" link', () => {
		// TODO: finish; need to check for returned a.png link
		sb.stub(Math, 'random', () => 0);
		const req = sb
			.stub(request, 'get')
			.returns(Promise.resolve(JSON.stringify({
				data: [
					{ hash: 'a', ext: '.png' },
					{ hash: 'b', ext: '.jpg' },
					{ hash: 'c', ext: '.png' }
				]
			})));
		const spy = sb.spy(cleanReply);

		sb.randFun.run(sb.message);

		expect(req).to.have.been.calledOnce;
		expect(spy).to.have.been.calledOnce;
	});

	it('should use cache', () => {
		//
	});

	it('should return default image', () => {
		// const req = sb
		// 	.stub(request, 'get')
		// 	.returns(Promise.resolve());

		// sb.randFun.run(sb.message);
	});
});
