'use strict';

module.exports = {
	isUrl: item => (item.search(/https?:\/\/[^ \/\.]+\.[^ \/\.]+/) !== -1), // eslint-disable-line no-useless-escape
	isString: str => typeof str === 'string' || str instanceof String,
	isNumber: number => (!isNaN(number) && isFinite(number))
};
