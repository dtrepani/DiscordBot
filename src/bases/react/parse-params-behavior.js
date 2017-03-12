'use strict';

module.exports = class ParseParamsBehavior {
	/**
	 * @abstract
	 * Parse parameters and put into appropriate names.
	 * Property that args must always contain, but is not limited to: reaction
	 * @param {CommandMessage} msg
	 * @param {*[]} args
	 * @returns {*[]} Parsed args
	 */
	parseParams(msg, args) {
		return args;
	}
};
