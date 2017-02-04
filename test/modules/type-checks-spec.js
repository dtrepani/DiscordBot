/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const typeChecks = require('../../src/modules/type-checks');

describe('typeChecks', () => {
	describe('#isUrl()', () => {
		const isUrl = typeChecks.isUrl;

		it('should be url with http', () => {
			expect(isUrl('http://google.com')).to.be.true;
		});

		it('should not be url with http', () => {
			expect(isUrl('http://google')).to.be.false;
			expect(isUrl('www.google.com')).to.be.false;
		});
	});

	describe('#isString()', () => {
		const isString = typeChecks.isString;

		it('should be string', () => {
			expect(isString('A string!')).to.be.true;
		});

		it('should not be a string', () => {
			expect(isString(10)).to.be.false;
			expect(isString(true)).to.be.false;
			expect(isString({})).to.be.false;
		});
	});

	describe('#isNumber()', () => {
		const isNumber = typeChecks.isNumber;
		
		it('should be a number', () => {
			expect(isNumber(10)).to.be.true;
			expect(isNumber('10')).to.be.true;
			expect(isNumber(12.34)).to.be.true;
		});

		it('should not be a number', () => {
			expect(isNumber('String')).to.be.false;
			expect(isNumber('$12.34')).to.be.false;
			expect(isNumber({ num: 23 })).to.be.false;
		});
	});
});
