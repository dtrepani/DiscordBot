'use strict';

const Commando = require('discord.js-commando');
const Cleverbot = require('cleverbot-node');

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
	}

	async run(msg, args) {
		const cleverbot = new Cleverbot;
		return Cleverbot.prepare(() => {
			cleverbot.write(args.text, res => msg.reply(res.message));
		});
	}
};
