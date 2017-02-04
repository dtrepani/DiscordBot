/* eslint-disable no-unused-expressions, no-invalid-this */
'use strict';

const { CommandMessage } = require('discord.js-commando');
const sendError = require('../../src/modules/send-error');
const { oneLine } = require('common-tags');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

describe('sendError', () => {
	let sb;

	before(() => {
		sb = sinon.sandbox.create();
	});

	beforeEach(() => {
		const client = { commandPrefix: '~' };
		sb.msg = new CommandMessage({ client: client }, { name: 'foo' });
	});

	afterEach(() => sb.restore());

	it('should convert string to Error', () => {
		const err = 'An error!';
		const reply = sb.stub(CommandMessage.prototype, 'reply', (content) => {
			expect(content).to.equal(oneLine`:no_entry_sign: **__Error__**: ${err} 
				Use \`${sb.msg.client.commandPrefix}help ${sb.msg.command.name}\` 
				for details on the command.`);
		});
		sendError(sb.msg, err);
		expect(reply).to.have.been.calledOnce;
	});
	
	it('should add a period to the error message', () => {
		const err = new Error('An error');
		const reply = sb.stub(CommandMessage.prototype, 'reply', (content) => {
			expect(content).to.equal(oneLine`:no_entry_sign: **__${err.name}__**: ${err.message}. 
				Use \`${sb.msg.client.commandPrefix}help ${sb.msg.command.name}\` 
				for details on the command.`);
		});
		sendError(sb.msg, err);
		expect(reply).to.have.been.calledOnce;
	});
	
	it('should show that err is a TypeError', () => {
		const err = new TypeError('An error!');
		const reply = sb.stub(CommandMessage.prototype, 'reply', (content) => {
			expect(content).to.equal(oneLine`:no_entry_sign: **__TypeError__**: ${err.message} 
				Use \`${sb.msg.client.commandPrefix}help ${sb.msg.command.name}\` 
				for details on the command.`);
		});
		sendError(sb.msg, err);
		expect(reply).to.have.been.calledOnce;
	});
	
	it('should throw TypeError', () => {
		expect(() => sendError(sb.msg, 1234)).to.throw(TypeError);
	});
});
