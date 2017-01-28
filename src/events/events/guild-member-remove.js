'use strict';

const EventLog = require('../base');
const EventEmbed = require('../event-embed');

module.exports = class GuildMemberRemoveEvent extends EventLog {
	constructor(client) {
		super(client, { name: 'guildMemberRemove' });
	}

	/**
	 * @param {GuildMember} member - User that left the guild
	 */
	run(member) {
		const embed = {
			description: `${member} Left :cry:`,
			author: {
				name: `${member.user.username}#${member.user.discriminator}`,
				icon_url: member.user.avatarURL // eslint-disable-line camelcase
			},
			thumbnail: { url: member.user.avatarURL }
		};

		EventEmbed.sendUserEmbed(this.getLogChannel(member.guild), member.user.id, embed);
	}
};
