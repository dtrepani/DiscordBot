'use strict';

const { isNumber } = require('../../modules/type-checks');
const ParseParamsBehavior = require('./parse-params-behavior');

module.exports = class ForNumberPPBehavior extends ParseParamsBehavior {
	/** @override */
	parseParams(msg, args) {
		const reactionInfo = args.reactionInfo.split(' ');

		if(reactionInfo.length <= 1 || !isNumber(reactionInfo[0])) {
			args.msgInd = 0;
			args.reaction = args.reactionInfo;
			return args;
		}

		args.msgInd = this._getMsgInd(reactionInfo);
		args.reaction = reactionInfo.slice(1).join();
		return args;
	}

	_getMsgInd(reactionInfo) {
		const msgInd = parseInt(reactionInfo[0]);

		if(msgInd > 100) {
			throw new Error('I cannot react to messages more than 100 messages back.');
		}

		// Users give an index 1 to 100, while arrays operate on 0 to 99.
		return msgInd - 1;
	}
};
