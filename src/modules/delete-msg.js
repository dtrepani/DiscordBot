'use strict';

const winston = require('winston');

/**
 * @param {CommandMessage} msg
 * @param {boolean} [deleteFlag = true] - Whether to actually delete the message
 * @param {int} [delDelay = 200] - Delay before deleting message (in milliseconds)
 */
module.exports = (msg, deleteFlag = true, delDelay = 200) => {
	if(deleteFlag) {
		msg.delete(delDelay)
			.catch(err => winston.error(`Message was already deleted.`));  // eslint-disable-line
	}
};
