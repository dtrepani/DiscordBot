'use strict';

const Discord = require('discord.js');

module.exports = class EventEmbed {
	/**
	 * @param guild - Guild to get log channel for
	 * @returns {GuildChannel} Channel to log to; defaults to #mod-log
	 */
	static getLogChannel(guild) {
		return guild.defaultChannel;
	}

	/**
	 * Embed for user-related events
	 * @see sendEmbed()
	 */
	static sendUserEmbed(guild, id, embedInfo) {
		EventEmbed.sendEmbed('#eacb00', guild, id, embedInfo);
	}

	/**
	 * Embed for message-related events
	 * @see sendEmbed()
	 */
	static sendMessageEmbed(guild, id, embedInfo) {
		this.sendEmbed('#cb0f0f', guild, id, embedInfo);
	}

	/**
	 * Embed for text channel-related events
	 * @see sendEmbed()
	 */
	static sendChannelEmbed(guild, id, embedInfo) {
		EventEmbed.sendEmbed('#67a4e2', guild, id, embedInfo);
	}

	/**
	 * Embed for voice channel-related events
	 * @see sendEmbed()
	 */
	static sendVoiceEmbed(guild, id, embedInfo) {
		EventEmbed.sendEmbed('#8e72e2', guild, id, embedInfo);
	}

	/**
	 * @param {string|number|number[]} color - Color of embed
	 * @param {Guild} guild - Guild to log to
	 * @param {String} id - ID of event to log in footer.
	 * @param {RichEmbed} embedInfo - Information to include in the embed
	 */
	static sendEmbed(color, guild, id, embedInfo) {
		const channel = EventEmbed.getLogChannel(guild);

		let embed = new Discord.RichEmbed(embedInfo);
		embed.setDescription(`**${embedInfo.description}**`);
		embed.setColor(color);
		embed.setFooter(`ID: ${id}`);
		embed.setTimestamp(new Date());

		channel.sendEmbed(embed);
	}
};