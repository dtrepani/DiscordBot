'use strict';

const Commando = require('discord.js-commando');
const alerts = require('../../modules/alerts');

/**
 * Enables typing while processing HTTP requests
 */
module.exports = class WebCommand extends Commando.Command {
	async run(msg, args) {
		let res = {};
		msg.channel.startTyping();

		try {
			res = await this.query(msg, args);
		} catch(e) {
			res = alerts.sendError(e);
		}

		msg.channel.stopTyping();
		return res;
	}

	/**
	 * @abstract
	 * @param {CommandoMessage} msg
	 * @param {*} args
	 */
	async query(msg, args) { // eslint-disable-line no-unused-vars
		throw new Error(`${this.constructor.name} doesn't have a query() method.`);
	}
};
