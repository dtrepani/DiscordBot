'use strict';

const Commando = require('discord.js-commando');
const config = require('../../assets/config.json');
const request = require('request-promise');
const sendError = require('../../modules/send-error');
const winston = require('winston');

module.exports = class CleverbotCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'cleverbot',
			aliases: [
				'bot',
				'timothy',
				'timmy',
				'talk'
			],
			group: 'fun',
			memberName: 'cleverbot',
			description: `Talk to me!`,
			args: [
				{
					key: 'text',
					prompt: 'What question would you like to say?',
					type: 'string'
				}
			]
		});
		
		this.cs = '';
	}

	async run(msg, args) {
		try {
			let query = `http://www.cleverbot.com/getreply?key=${config.tokens.cleverbot}&input=${encodeURIComponent(args.text)}`; // eslint-disable-line max-len
			if(this.cs !== '') query += `&cs=${this.cs}`;

			const res = JSON.parse(await request.get(query));

			if(this.cs !== '') this.cs = res.cs;
			msg.reply(res.output);
		} catch(err) {
			if(err.hasOwnProperty('error')) {
				const errInfo = JSON.parse(err.error);
				err.error = `${errInfo.status}: ${errInfo.error}`;
				err.message = err.error;
			}

			winston.error(err);
			sendError(msg, err);
		}
	}
};
