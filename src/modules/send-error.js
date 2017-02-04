'use strict';

const { isString } = require('./type-checks');
const { oneLine } = require('common-tags');

/**
 * @param {CommandMessage} msg
 * @param {Error|string} err
 * @returns {Promise}
 */
module.exports = (msg, err) => {
	if(!(err instanceof Object)) {
		if(!isString(err)) throw new TypeError(`Parameter 'err' must be an Error object or a string.`);
		err = new Error(err);
	}

	const punctuation = (['.', '!', '?'].indexOf(err.message.slice(-1)) !== -1) ? '' : '.';

	return msg.reply(oneLine`:no_entry_sign: **__${err.name}__**: ${err.message}${punctuation} 
		Use \`${msg.client.commandPrefix}help ${msg.command.name}\` for details on the command.`);
};
