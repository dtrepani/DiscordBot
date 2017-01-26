const Commando = require('discord.js-commando');
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
		return msg.embed({
			color: 3447003,
			description: '**Timothy Statistics**',
			fields: [
				{
					name: '❯ Uptime',
					value: moment.duration(this.client.uptime)
						.format('d[ days], h[ hours], m[ minutes, and ]s[ seconds]'),
					inline: true
				},
				{
					name: '❯ Memory usage',
					value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
					inline: true
				},
				{
					name: '❯ General Stats',
					value: stripIndents`
					• Guilds: ${this.client.guilds.size}
					• Channels: ${this.client.channels.size}
					• Users: ${this.client.guilds.map(guild => guild.memberCount).reduce((a, b) => a + b)}
					`,
					inline: true
				},
				{
					name: '❯ Version',
					value: `v${version}`,
					inline: true
				}
			],
			thumbnail: { url: this.client.user.avatarURL }
		});
	}
};
