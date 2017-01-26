'use strict';

const EventLog = require('../base');
const EventEmbed = require('../event-embed');
const winston = require('winston');
const config = require('../../assets/config.json');

module.exports = class GuildMemberUpdateEvent extends EventLog {
	constructor(client) {
		super(client, { name: 'guildMemberUpdate' });
	}

	/**
	 * @param {GuildMember} before - User before the change
	 * @param {GuildMember} after - User after the change
	 */
	run(before, after) {
		let embed = {
			author: {
				name: `${after.user.username}#${after.user.discriminator}`,
				icon_url: after.user.avatarURL
			}
		};

		const descriptors = this.getChangedDescriptors(before, after);
		if(!descriptors) {
			winston.debug(before);
			winston.debug(after);
			return;
		}

		Object.assign(embed, descriptors);
		EventEmbed.sendUserEmbed(this.getLogChannel(before.guild), before.user.id, embed);
	}

	getChangedDescriptors(before, after) {
		let statChanged = '';
		let changedVal = '';

		if(before.user.username !== after.user.username) {
			statChanged = 'Username';
			changedVal = 'user.username';
		} else if(before.nickname !== after.nickname) {
			statChanged = 'Nickname';
			changedVal = 'nickname';
		}

		// TODO: roles

		if(!statChanged) return false;

		return {
			description: `${before.user} ${statChanged} Changed`,
			fields: [
				{
					name: `${config.embed_prefix} Before`,
					value: `${before[changedVal] || 'None'}`,
					inline: true
				},
				{
					name: `${config.embed_prefix} After`,
					value: `${after[changedVal] || 'None'}`,
					inline: true
				}
			]
		};
	}
};
