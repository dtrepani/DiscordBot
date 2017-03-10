'use strict';

const EventLog = require('../base');
const EventEmbed = require('../event-embed');
const { isSplatRole } = require('../../modules/type-checks');

module.exports = class RoleDeleteEvent extends EventLog {
	constructor(client) {
		super(client, { name: 'roleDelete' });
	}

	/**
	 * @param {Role} role - Role deleted
	 */
	_run(role) {
		if(isSplatRole(role)) return;

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
