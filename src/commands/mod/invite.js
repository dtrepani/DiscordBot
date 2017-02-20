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
			description: 'Get OAuth2 link',
			guarded: true
		});
	}

	hasPermission(msg) {
		return msg.author.id === this.client.options.owner;
	}

	async run(msg) {
		msg.delete();
		return msg.direct(`https://discordapp.com/api/oauth2/authorize?client_id=${config[process.env.NODE_ENV || 'development'].client_id}&scope=bot&permissions=${config.permissions}`, {}); // eslint-disable-line max-len, no-process-env
	}
};
