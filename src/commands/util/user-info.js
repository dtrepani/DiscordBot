'use strict';

const cleanReply = require('../../modules/clean-reply');
const Commando = require('discord.js-commando');
const config = require('../../assets/config.json');
const { stripIndents } = require('common-tags');

module.exports = class UserInfoCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'user-info',
			aliases: ['user'],
			group: 'util',
			memberName: 'user-info',
			description: 'Gets information about a user.',
			examples: ['user-info @Kyuu#9384', 'user-info Kyuu'],
			guildOnly: true,
			args: [
				{
					key: 'member',
					prompt: 'What user?',
					type: 'member'
				}
			]
		});
	}

	async run(msg, args) {
		const member = args.member;
		const prefix = config.embed_prefix;
		const bullet = config.embed_bullet;
		const embed = {
			author: {
				name: `${member.user.username}#${member.user.discriminator}`,
				icon_url: member.user.avatarURL // eslint-disable-line camelcase
			},
			thumbnail: { url: member.user.avatarURL },
			description: `**${member.user.bot ? 'Bot' : 'User'} ${member} Statistics**`,
			footer: { text: `User ID: ${member.user.id}` },
			fields: [
				{
					name: `${prefix} Personal Details`,
					value: stripIndents`
							${bullet} **Status**: ${this._getPresence(member)}
							${bullet} **Current Game**: ${member.user.presence.game
								? member.user.presence.game.name
								: 'None'}
							${bullet} **Created**: ${member.user.createdAt}
						`,
					inline: true
				},
				{
					name: `${prefix} Guild-Related Details`,
					value: stripIndents`
							${bullet} **Nickname**: ${member.nickname || 'None'}
							${bullet} **Roles**: ${member.roles.map(roles => roles.name).join(', ')}
							${bullet} **Joined**: ${member.joinedAt}
						`,
					inline: true
				}
			]
		};

		return cleanReply(msg, { embed: embed }, { disableEveryone: true });
	}

	_getPresence(member) {
		switch(member.user.presence.status) {
		case 'online':
			return `Online :green_heart:`;
		case 'offline':
			return `Offline :black_heart:`;
		case 'idle':
			return `Idle :yellow_heart:`;
		case 'dnd':
			return `Do Not Disturb :heart:`;
		default:
			return 'None';
		}
	}
};
