'use strict';

const { oneLine } = require('common-tags');
const EventLog = require('../base');
const EventEmbed = require('../event-embed');
const config = require('../../assets/config.json');

module.exports = class GuildMemberUpdateEvent extends EventLog {
	constructor(client) {
		super(client, { name: 'guildMemberUpdate' });
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
				name: `${after.user.username}#${after.user.discriminator}`,
				icon_url: after.user.avatarURL // eslint-disable-line camelcase
			}
		};
		Object.assign(embed, descriptors);
		EventEmbed.sendUserEmbed(this._getLogChannel(before.guild), before.user.id, embed);
	}

	_getChangedDescriptors(before, after) {
		if(before.user.username !== after.user.username) {
			return this._constructEmbed('username', before.user, before.user.nickname, after.user.nickname);
		}

		if(before.nickname !== after.nickname) {
			return this._constructEmbed('nickname', before.user, before.nickname, after.nickname);
		}

		if(!before.roles.equals(after.roles)) {
			if(before.roles.size > after.roles.size) {
				return {
					description: oneLine`${before.user} was removed from role: 
						${this._getRoleDiff(before, after).name} ⚔`
				};
			}
			
			return { description: `${before.user} was added to role: ${this._getRoleDiff(after, before).name} ⚔` };
		}

		return false;
	}

	_getRoleDiff(origRoles, comparedRoles) {
		return origRoles.roles.filterArray(role => !comparedRoles.roles.exists('name', role.name))[0];
	}

	/**
	 * @param {String} statChanged - Stat that was changed
	 * @param {User} user
	 * @param {?*} beforeVal - Value before the change
	 * @param {?*} afterVal - Value after the change
	 * @returns {Embed}
	 */
	_constructEmbed(statChanged, user, beforeVal, afterVal) {
		return {
			description: `${user}'s ${statChanged} changed 👥`,
			fields: [
				{
					name: `${config.embed_prefix} Before`,
					value: `${beforeVal || 'None'}`,
					inline: true
				},
				{
					name: `${config.embed_prefix} After`,
					value: `${afterVal || 'None'}`,
					inline: true
				}
			]
		};
	}
};
