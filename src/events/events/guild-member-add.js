'use strict';

const EventLog = require('../base');
const EventEmbed = require('../event-embed');

module.exports = class GuildMemberAddEvent extends EventLog {
	constructor(client) {
		super(client, { name: 'guildMemberAdd' });
	}

	/**
	 * @param {GuildMember} member - User that joined the guild
	 */
	run(member) {
		let embed = {
			description: `${member} Joined :smiley:`,
			author: {
				name: `${member.user.username}#${member.user.discriminator}`,
				icon_url: member.user.avatarURL
			},
			thumbnail: {
				url: member.user.avatarURL
			}
		};

		EventEmbed.sendUserEmbed(this.getLogChannel(member.guild), member.user.id, embed);
	}
};