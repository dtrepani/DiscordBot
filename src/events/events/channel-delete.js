'use strict';

const EventLog = require('../base');
const EventEmbed = require('../event-embed');
const Discord = require('discord.js');

module.exports = class ChannelDeleteEvent extends EventLog {
	constructor(client) {
		super(client, { name: 'channelDelete' });
	}

	/**
	 * @param {Channel} channel - Channel deleted
	 */
	_run(channel) {
		let sendEmbed = EventEmbed.sendTextChannelEmbed;
		let channelType = 'Text';

		if(channel instanceof Discord.VoiceChannel) {
			sendEmbed = EventEmbed.sendVoiceChannelEmbed;
			channelType = 'Voice';
		}

		const embed = {
			author: {
				name: `${channel.guild.name}`,
				icon_url: channel.guild.iconURL // eslint-disable-line camelcase
			},
			description: `${channelType} channel deleted: #${channel.name} 🗑️`
		};

		sendEmbed(this._getLogChannel(channel.guild), channel.guild.id, embed);
	}
};
