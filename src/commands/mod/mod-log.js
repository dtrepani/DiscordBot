'use strict';

const Commando = require('discord.js-commando');
const { oneLine } = require('common-tags');
const alerts = require('../../modules/alerts');

module.exports = class ModLogCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'mod-log',
			alias: ['log'],
			group: 'mod',
			memberName: 'mod-log',
			description: 'Enable or disable the mod log.',
			details: oneLine`If no channel is provided for the mod log, it will default previously set channel or
				#mod-log, but only if either are valid channels.`,
			guildOnly: true,
			guarded: true,
			args: [
				{
					key: 'enabled',
					prompt: 'Enable mod log? (true/false)',
					type: 'boolean'
				},
				{
					key: 'channel',
					prompt: 'What channel should I send logs to?',
					type: 'channel',
					default: ''
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.member.permissions.hasPermission('ADMINISTRATOR');
	}

	async run(msg, args) {
		try {
			const guild = msg.guild;
			const oldModLogSettings = this.client.provider.get(guild, 'mod_log', {});
			const channelID = args.channel.id ||
				oldModLogSettings.channelID ||
				guild.channels.find('name', 'mod-log').id;

			if(!channelID) {
				throw new Error(`Please provide a valid channel.`);
			}

			const modLogSettings = {
				enabled: args.enabled,
				channelID: channelID
			};

			return this.client.provider.set(guild, 'mod_log', modLogSettings)
				.then(() => {
					if(args.enabled) return msg.reply(`Logging is now enabled in ${guild.channels.get(channelID)}`);
					return msg.reply('Logging is now disabled.');
				})
				.catch(err => { throw new Error(err); });
		} catch(err) {
			return alerts.sendError(msg, err);
		}
	}
};
