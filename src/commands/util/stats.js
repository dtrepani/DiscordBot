'use strict';

const Commando = require('discord.js-commando');
const config = require('../../assets/config.json');
const moment = require('moment');
const momentDurFormat = require('moment-duration-format'); // eslint-disable-line no-unused-vars
const stripIndents = require('common-tags').stripIndents;
const version = require('../../../package').version;

module.exports = class StatsCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'stats',
			aliases: ['statistics'],
			group: 'util',
			memberName: 'stats',
			description: 'Displays statistics about the bot.'
		});
	}

	async run(msg) {
		const prefix = config.embed_prefix;
		const bullet = config.embed_bullet;
		
		return msg.embed({
			color: 3447003,
			description: '**Timothy Statistics**',
			thumbnail: { url: this.client.user.avatarURL },
			footer: { 
				text: 'Powered by Discord.js',
				icon_url: 'http://i.imgur.com/MjD5B8b.png' // eslint-disable-line camelcase
			},
			fields: [
				{
					name: `${prefix} Uptime`,
					value: moment.duration(this.client.uptime)
						.format('d[ days], h[ hours], m[ minutes, and ]s[ seconds]'),
					inline: true
				},
				{
					name: `${prefix} Memory Usage`,
					value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
					inline: true
				},
				{
					name: `${prefix}General`,
					value: stripIndents`
						${bullet} **Guilds**: ${this.client.guilds.size}
						${bullet} **Channels**: ${this.client.channels.size}
						${bullet} **Users**: ${this.client.guilds.map(guild => guild.memberCount)
																.reduce((a, b) => a + b)}
					`,
					inline: true
				},
				{
					name: `${prefix}Version`,
					value: `v${version}`,
					inline: true
				}
			]
		});
	}
};
