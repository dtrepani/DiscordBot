/* eslint-disable no-unused-expressions */
'use strict';

const expect = require('chai').expect;
const stringFormat = require('../../src/modules/string-format');

describe('stringFormat', () => {
	describe('#capitalizeFirstLetter()', () => {
		it('should capitalize the first letter of string', () => {
			const str = 'lowercase';
			expect(stringFormat.capitalizeFirstLetter(str)).to.equal('Lowercase');
		});
	});

	describe('#toTitleCase()', () => {
		it('should convert string to title case', () => {
			const str = 'this is a lowercase string';
			expect(stringFormat.toTitleCase(str)).to.equal('This Is A Lowercase String');
		});
	});

	describe('#camelCaseToDash()', () => {
		it('should convert camelcase string to dash format', () => {
			const str = 'camelCaseString';
			expect(stringFormat.camelCaseToDash(str)).to.equal('camel-case-string');
		});
	});
});
