/* eslint-disable valid-jsdoc */

'use strict';

const Discord = require('discord.js');

module.exports = class EventEmbed {
	/**
	 * Embed for general events
	 * @see _sendEmbed()
	 */
	static sendGeneralEmbed(channel, id, embedInfo) {
		EventEmbed._sendEmbed('#52b069', channel, id, embedInfo);
	}

	/**
	 * Embed for user-related events
	 * @see _sendEmbed()
	 */
	static sendUserEmbed(channel, id, embedInfo) {
		EventEmbed._sendEmbed('#e2b212', channel, id, embedInfo);
	}

	/**
	 * Embed for message-related events
	 * @see _sendEmbed()
	 */
	static sendMessageEmbed(channel, id, embedInfo) {
		this._sendEmbed('#c83122', channel, id, embedInfo);
	}

	/**
	 * Embed for text channel-related events
	 * @see _sendEmbed()
	 */
	static sendTextChannelEmbed(channel, id, embedInfo) {
		EventEmbed._sendEmbed('#67a4e2', channel, id, embedInfo);
	}

	/**
	 * Embed for user-related events that take place in a voice channel
	 * @see _sendEmbed()
	 */
	static sendVoiceChannelUserEmbed(channel, id, embedInfo) {
		EventEmbed._sendEmbed('#8e72e2', channel, id, embedInfo);
	}
	/**
	 * Embed for voice channel-related events
	 * @see _sendEmbed()
	 */
	static sendVoiceChannelEmbed(channel, id, embedInfo) {
		EventEmbed._sendEmbed('#d36dbf', channel, id, embedInfo);
	}

	/**
	 * @param {string|number|number[]} color - Color of embed
	 * @param {GuildChannel} channel - Channel to send embed to
	 * @param {String} id - ID to add to footer
	 * @param {RichEmbed} embedInfo - Information to include in the embed
	 */
	static _sendEmbed(color, channel, id, embedInfo) {
		const embed = new Discord.RichEmbed(embedInfo);
		embed.setDescription(`**${embedInfo.description}**`);
		embed.setColor(color);
		embed.setFooter(`ID: ${id}`);
		embed.setTimestamp(new Date());

		if(channel) channel.sendEmbed(embed);
	}
};
