'use strict';

const winston = require('winston');

/**
 * @param {CommandMessage} msg
 * @param {int} [delDelay = 2000] - Delay before deleting message (in milliseconds)
 */
module.exports = (msg, delDelay = 2000) => {
	msg.delete(delDelay)
		.catch(err => winston.error(`Message was already deleted.`));  // eslint-disable-line
};
