'use strict';

const EventLog = require('../base');
const EventEmbed = require('../event-embed');
const { oneLine } = require('common-tags');

module.exports = class VoiceStateUpdateEvent extends EventLog {
	constructor(client) {
		super(client, { name: 'voiceStateUpdate' });
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
		const descriptors = this.getChangedDescriptors(before, after);
		if(!descriptors) return;
		Object.assign(embed, descriptors);

		EventEmbed.sendVoiceEmbed(this.getLogChannel(before.guild), before.user.id, embed);
	}

	getChangedDescriptors(before, after) {
		if(before.voiceChannelID === after.voiceChannelID) return false;

		if(!before.voiceChannelID) {
			return { description: `${after.user} entered voice channel ${this.getVoiceChannel(after)}` };
		}

		if(!after.voiceChannelID) {
			return { description: `${before.user} left voice channel ${this.getVoiceChannel(before)}` };
		}

		return {
			description: oneLine`${before.user} moved from ${this.getVoiceChannel(before)}
				to ${this.getVoiceChannel(after)}`
		};
	}

	/**
	 * @param {GuildMember} member
	 */
	getVoiceChannel(member) {
		return member.guild.channels.get(member.voiceChannelID);
	}
};
