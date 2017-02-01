'use strict';

const { Command } = require('discord.js-commando');
const cleanReply = require('../../modules/clean-reply');
const twemoji = require('twemoji');

module.exports = class CatCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'emoji',
			aliases: ['emojis'],
			group: 'fun',
			memberName: 'emoji',
			description: 'Get a bigger emoji.',
			args: [
				{
					key: 'emoji',
					prompt: 'What emoji?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		let res = '';
		twemoji.parse(args.emoji, {
			callback: (icon, options) => {
				res = `${options.base}${options.size}/${icon}${options.ext}`;
			}
		});

		if(!res) {
			const re = new RegExp('^<:.+:(.+)>$');
			const matches = args.emoji.match(re);
			if(matches) res = `https://cdn.discordapp.com/emojis/${matches[1]}.png`;
		}

		return cleanReply(msg, res || 'No emoji found.');
	}
};
