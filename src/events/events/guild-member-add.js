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
	_run(member) {
		const embed = {
			description: `${member} joined the guild 😃`,
			author: {
				name: `${member.user.username}#${member.user.discriminator}`,
				icon_url: member.user.avatarURL // eslint-disable-line camelcase
			},
			thumbnail: { url: member.user.avatarURL }
		};

		EventEmbed.sendUserEmbed(this._getLogChannel(member.guild), member.user.id, embed);
	}
};
