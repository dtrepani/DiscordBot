'use strict';

const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const cleanReply = require('../../modules/clean-reply');
const sendError = require('../../modules/send-error');

module.exports = class NickCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nick',
			aliases: ['nickname'],
			group: 'util',
			memberName: 'nick',
			description: `Set a your own or another user's nickname.`,
			details: oneLine`Remember to encapsulate multi-word nicknames in quotations. 
				Use "nick remove" to remove nicknames.`,
			examples: [
				'nick "My New Nickname"',
				'nick "[BANNED] Some Nerd" @Kyuu#9384',
				'nick remove @Kyuu#9384'
			],
			guildOnly: true,
			args: [
				{
					key: 'nickname',
					prompt: 'What nickname?',
					type: 'string'
				},
				{
					key: 'member',
					prompt: 'For which user?',
					type: 'member',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		try {
			if(args.nickname.toLowerCase() === 'remove') {
				args.nickname = '';
			}

			this.checkNicknameLength(args.nickname);

			if(args.member) {
				return await this.changeAnotherUsersNickname(msg, args);
			}

			return await this.changeNickname(msg, args.nickname, msg.member);
		} catch(err) {
			return sendError(msg, err);
		}
	}

	async changeAnotherUsersNickname(msg, args) {
		if(!msg.member.permissions.hasPermission('MANAGE_NICKNAMES')) {
			throw new Error(`You do not have permission to change another user's nickname.`);
		}
		return await this.changeNickname(msg, args.nickname, args.member);
	}

	async changeNickname(msg, nickname, member) {
		if(member === msg.guild.owner) {
			throw new Error(`I can't change the nickname of the server owner. 😢`);
		}

		try {
			await member.setNickname(nickname);
			return cleanReply(msg, `${member}'s nickname has been changed.`);
		} catch(err) {
			throw new Error(oneLine`I can't change that user's nickname. 
				Ask the server's owner to move my role rank up.`);
		}
	}

	checkNicknameLength(nickname) {
		const maxNickLen = 32;
		if(nickname.length > maxNickLen) {
			throw new Error('That nickname is too long. Nicknames must be 32 characters or less.');
		}
	}
};
