'use strict';

const EventLog = require('../base');
const EventEmbed = require('../event-embed');

module.exports = class RoleDeleteEvent extends EventLog {
	constructor(client) {
		super(client, { name: 'roleDelete' });
	}

	/**
	 * @param {Role} role - Role deleted
	 */
	_run(role) {
		const embed = {
			author: {
				name: `${role.guild.name}`,
				icon_url: role.guild.iconURL // eslint-disable-line camelcase
			},
			description: `Role deleted: ${role.name} 🗑️`
		};

		EventEmbed.sendGeneralEmbed(this._getLogChannel(role.guild), role.guild.id, embed);
	}
};
