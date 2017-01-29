'use strict';

const { oneLine } = require('common-tags');
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
	_run(before, after) {
		const embed = {
			author: {
				name: `${after.user.username}#${after.user.discriminator}`,
				icon_url: after.user.avatarURL // eslint-disable-line camelcase
			}
		};

		const descriptors = this._getChangedDescriptors(before, after);
		if(!descriptors) {
			winston.debug(before);
			winston.debug(after);
			return;
		}

		Object.assign(embed, descriptors);
		EventEmbed.sendUserEmbed(this._getLogChannel(before.guild), before.user.id, embed);
	}

	_getChangedDescriptors(before, after) {
		if(before.user.username !== after.user.username) {
			return this._constructEmbed('Username', before.user.nickname, after.user.nickname);
		}

		if(before.nickname !== after.nickname) {
			return this._constructEmbed('Nickname', before.nickname, after.nickname);
		}

		if(!before.roles.equals(after.roles)) {
			if(before.roles.size > after.roles.size) {
				return {
					description: oneLine`${before.user} was removed from the 
						\`${this._getRoleDiff(before, after).name}\` role.`
				};
			}
			
			return {
				description: oneLine`${before.user} was added to the 
					\`${this._getRoleDiff(after, before).name}\` role.`
			};
		}

		return false;
	}

	_getRoleDiff(origRoles, comparedRoles) {
		return origRoles.roles.filterArray(role => !comparedRoles.roles.exists('name', role.name))[0];
	}

	/**
	 * @param {String} statChanged - Stat that was changed
	 * @param {?*} beforeVal - Value before the change
	 * @param {?*} afterVal - Value after the change
	 * @returns {Embed}
	 */
	_constructEmbed(statChanged, beforeVal, afterVal) {
		return {
			description: `${before.user} ${statChanged} Changed`,
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
