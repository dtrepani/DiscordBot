/* eslint-disable no-unused-expressions, no-invalid-this */
'use strict';

const { CommandMessage } = require('discord.js-commando');
const deleteMsg = require('../../src/modules/delete-msg');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));

describe('deleteMsg', () => {
	let sb;

	before(() => {
		sb = sinon.sandbox.create();
	});

	beforeEach(() => {
		// Can't easily test for when CommandMessage.delete() fails, so assume it always resolves.
		sb.delMsg = sb.stub(CommandMessage.prototype, 'delete').returns(Promise.resolve());
	});

	afterEach(() => sb.restore());

	it('should call #delete() once', () => {
		const msg = new CommandMessage({ channel: { type: 'text' } });
		deleteMsg(msg);
		expect(sb.delMsg).to.have.been.calledOnce;
	});
	
	it('should not call #delete()', () => {
		const msg = new CommandMessage({ channel: { type: 'dm' } });
		deleteMsg(msg);
		expect(sb.delMsg).to.not.have.been.called;
	});
});
