'use strict';

const { oneLine } = require('common-tags');
const config = require('../../assets/config.json');
const EventEmbed = require('../event-embed');
const EventLog = require('../base');

module.exports = class VoiceStateUpdateEvent extends EventLog {
	constructor(client) {
		super(client, { name: 'voiceStateUpdate' });
	}

	/**
	 * @param {GuildMember} before - User before the change
	 * @param {GuildMember} after - User after the change
	 */
	_run(before, after) {
		const descriptors = this._getChangedDescriptors(before, after);
		if(!descriptors) return;
		const embed = {
			author: {
				name: `${before.user.username}#${before.user.discriminator}`,
				icon_url: before.user.avatarURL // eslint-disable-line camelcase
			}
		};
		Object.assign(embed, descriptors);

		EventEmbed.sendVoiceChannelUserEmbed(this._getLogChannel(before.guild), before.user.id, embed);
	}

	_getChangedDescriptors(before, after) {
		if(before.voiceChannelID === after.voiceChannelID) return false;

		if(!before.voiceChannelID) {
			return { description: `${after.user} entered voice channel ${this._getVoiceChannel(after)} 🎙` };
		}

		if(!after.voiceChannelID) {
			return { description: `${before.user} left voice channel ${this._getVoiceChannel(before)} 👋` };
		}

		return {
			description: oneLine`${before.user} moved voice channels 🎙`,
			fields: [
				{
					name: `${config.embed_prefix} Before`,
					value: `${this._getVoiceChannel(before)}`,
					inline: true
				},
				{
					name: `${config.embed_prefix} After`,
					value: `${this._getVoiceChannel(after)}`,
					inline: true
				}
			]
		};
	}

	/**
	 * @param {GuildMember} member
	 * @returns {GuildChannel}
	 */
	_getVoiceChannel(member) {
		return member.guild.channels.get(member.voiceChannelID);
	}
};
