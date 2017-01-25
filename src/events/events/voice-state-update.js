'use strict';

const EventLog = require('../base');
const EventEmbed = require('../event-embed');
const { oneLine } = require('common-tags');
const config = require('../../assets/config.json');

module.exports = class VoiceStateUpdateEvent extends EventLog {
	constructor(client) {
		super(client, {
			name: 'voiceStateUpdate'
		});
	}

	/**
	 * @param {GuildMember} before - User before the change
	 * @param {GuildMember} after - User after the change
	 */
	run(before, after) {
		let embed = {
			author: {
				name: `${before.user.username}#${before.user.discriminator}`,
				icon_url: before.user.avatarURL
			}
		};
		const descriptors = VoiceStateUpdateEvent.getChangedDescriptors(before, after);
		Object.assign(embed, descriptors);

		EventEmbed.sendVoiceEmbed(before.guild, before.user.id, embed);
	}

	static getChangedDescriptors(before, after) {
		if(!before.voiceChannelID) {
			return { description: `${after.user} entered voice channel ${EventLog.getVoiceChannel(after)}` }
		}

		if(!after.voiceChannelID) {
			return { description: `${before.user} left voice channel ${EventLog.getVoiceChannel(before)}` }
		}

		return {
			description: oneLine`${before.user} moved from ${EventLog.getVoiceChannel(before)} 
				to ${EventLog.getVoiceChannel(after)}
		`}
	}
};