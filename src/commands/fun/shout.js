'use strict';

const { charToEmoji } = require('../../modules/string-format');
const { Command } = require('discord.js-commando');
const cleanReply = require('../../modules/clean-reply');

module.exports = class ShoutCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shout',
			group: 'fun',
			memberName: 'shout',
			description: 'Make your voice big and loud!',
			examples: ['shout "Convert me!"'],
			args: [
				{
					key: 'phrase',
					prompt: 'What do you want to shout?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		let result = '\n';

		for(let i = 0; i < args.phrase.length; i++) {
			result += `${charToEmoji(args.phrase[i]) || args.phrase[i]} `;
		}

		return cleanReply(msg, result);
	}
};
