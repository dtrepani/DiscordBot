/* eslint-disable no-unused-expressions, no-invalid-this */
'use strict';
process.env.NODE_ENV === 'test'; // eslint-disable-line no-process-env

const { Client, CommandMessage } = require('discord.js-commando');
const cleanReply = require('../../src/modules/clean-reply');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

describe('cleanReply', () => {
	let sb;

	before(() => {
		sb = sinon.sandbox.create();
	});

	beforeEach(() => {
		sb.message = {
			cleanContent: '~foo bar',
			client: new Client({ commandPrefix: '~' }),
			channel: { type: 'text' }
		};
		sb.command = { name: 'foo' };
		sb.msg = new CommandMessage(sb.message, sb.command, ' bar');
	});

	afterEach(() => sb.restore());

	it('should delete message', () => {
		const delMsg = sb.stub(CommandMessage.prototype, 'delete').returns(Promise.resolve());
		sb.stub(CommandMessage.prototype, 'reply');

		cleanReply(sb.msg, 'foo');

		expect(delMsg).to.have.been.calledOnce;
	});

	it('should not delete message', () => {
		const delMsg = sb.stub(CommandMessage.prototype, 'delete').returns(Promise.resolve());
		sb.stub(CommandMessage.prototype, 'reply');

		cleanReply(sb.msg, { content: 'foo', delMsg: false });

		expect(delMsg).to.not.have.been.calledOnce;
	});

	it('should not delete message if DM', () => {
		sb.msg.message.channel.type = 'dm';

		const delMsg = sb.stub(CommandMessage.prototype, 'delete').returns(Promise.resolve());
		sb.stub(CommandMessage.prototype, 'reply');

		cleanReply(sb.msg, 'foo');

		expect(delMsg).to.not.have.been.calledOnce;
	});

	it('should reply to message normally', () => {
		sb.stub(CommandMessage.prototype, 'delete').returns(Promise.resolve());
		const reply = sb.stub(CommandMessage.prototype, 'reply');

		cleanReply(sb.msg, 'foo');
		
		expect(reply).to.have.been.calledOnce;
	});

	it('should reply to message with embed', () => {
		sb.stub(CommandMessage.prototype, 'delete').returns(Promise.resolve());
		const replyEmbed = sb.stub(CommandMessage.prototype, 'replyEmbed');

		cleanReply(sb.msg, { embed: { title: 'foo' } });
		
		expect(replyEmbed).to.have.been.calledOnce;
	});

	it('should display custom args', () => {
		sb.stub(CommandMessage.prototype, 'delete').returns(Promise.resolve());
		const reply = sb.stub(CommandMessage.prototype, 'reply', (content) => {
			expect(content).to.equal('`~foo qux`: foo');
		});

		cleanReply(sb.msg, { content: 'foo', argsDisplay: 'qux' });
		
		expect(reply).to.have.been.calledOnce;
	});

	it('should throw error', () => {
		expect(() => cleanReply(sb.msg, '')).to.throw(Error);
	});
});
