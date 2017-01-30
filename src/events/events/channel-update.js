'use strict';

const EventLog = require('../base');
const EventEmbed = require('../event-embed');
const Discord = require('discord.js');
const config = require('../../assets/config.json');

/**
 * Only checks for name changes in channels.
 */
module.exports = class ChannelUpdateEvent extends EventLog {
	constructor(client) {
		super(client, { name: 'channelUpdate' });
	}

	/**
	 * @param {Channel} before - Channel before the change
	 * @param {Channel} after - Channel after the change
	 */
	_run(before, after) {
		if(before.name === after.name) return;

		let sendEmbed = EventEmbed.sendTextChannelEmbed;
		let channelType = 'Text';
		let emoji = '📝';

		if(before instanceof Discord.VoiceChannel) {
			sendEmbed = EventEmbed.sendVoiceChannelEmbed;
			channelType = 'Voice';
			emoji = '🎙';
		}

		const embed = {
			author: {
				name: `${before.guild.name}`,
				icon_url: before.guild.iconURL // eslint-disable-line camelcase
			},
			description: `${channelType} channel name changed: ${before} ${emoji}`,
			fields: [
				{
					name: `${config.embed_prefix} Before`,
					value: `${before.name || 'None'}`,
					inline: true
				},
				{
					name: `${config.embed_prefix} After`,
					value: `${after.name || 'None'}`,
					inline: true
				}
			]
		};

		sendEmbed(this._getLogChannel(before.guild), before.guild.id, embed);
	}
};
