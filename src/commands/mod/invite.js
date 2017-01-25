'use strict';

const Commando = require('discord.js-commando');
const config = require('../../assets/config.json');

module.exports = class InviteCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'invite',
			aliases: ['invite'],
			group: 'mod',
			memberName: 'invite',
			description: 'Get OAuth2 link'
		});
	}

	async run(msg, args) {
		msg.delete();
		return msg.direct(`https://discordapp.com/api/oauth2/authorize?client_id=${config.client_id}&scope=bot&permissions=${config.permissions}`, {});
	}
};