'use strict';

const { Command } = require('discord.js-commando');
const cleanReply = require('../../modules/clean-reply');

module.exports = class SlashCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'slash',
			group: 'fun',
			memberName: 'slash',
			description: `Take your swords out and slash a user. ⚔️`,
			examples: ['slash @Kyuu#9384'],
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 60
			},
			args: [
				{
					key: 'member',
					prompt: 'Slash which user?',
					type: 'member'
				}
			]
		});
	}

	async run(msg, args) {
		return cleanReply(
			msg,
			`${args.member}, you've been slashed by the mighty ${msg.member}! SLASH!\nhttp://i.imgur.com/YWHdIKL.gif`
		);
	}
};
