'use strict';

const Commando = require('discord.js-commando');
const sendError = require('../modules/send-error');

/**
 * Enables typing while processing HTTP requests
 */
module.exports = class WebCommand extends Commando.Command {
	constructor(client, commandInfo) {
		const info = {
			group: 'web',
			args: [
				{
					key: 'query',
					prompt: 'What do you want to search for?',
					type: 'string'
				}
			]
		};
		Object.assign(info, commandInfo);
		super(client, info);
	}

	async run(msg, args) {
		/** @var {Promise} */
		let res = {};
		msg.channel.startTyping();

		try {
			res = await this._query(msg, args);
		} catch(err) {
			res = sendError(err);
		}

		msg.channel.stopTyping();
		return res;
	}

	/**
	 * @abstract
	 * @param {CommandoMessage} msg
	 * @param {*} args
	 */
	async _query(msg, args) { // eslint-disable-line no-unused-vars
		throw new Error(`${this.constructor.name} doesn't have a query() method.`);
	}
};
