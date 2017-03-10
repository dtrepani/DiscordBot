'use strict';

const { Command } = require('discord.js-commando');
const { isJarpyNickname } = require('../../modules/type-checks');
const { oneLine } = require('common-tags');
const cleanReply = require('../../modules/clean-reply');
const Discord = require('discord.js');
const sendError = require('../../modules/send-error');

module.exports = class JarpyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'jarpy',
			aliases: ['jarpies', 'jarpie'],
			group: 'fun',
			memberName: 'jarpy',
			description: `💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕`,
			examples: ['jarpy @Puffershark#3706'],
			guildOnly: true,
			args: [
				{
					key: 'member',
					prompt: 'Jarpy which user?',
					type: 'member'
				},
				{
					key: 'numOfThrows',
					prompt: 'How many times?',
					type: 'integer',
					default: 1,
					max: 10
				}
			]
		});
	}

	async run(msg, args) {
		if(args.member === msg.guild.owner) {
			return sendError(msg, `I can't jarpy the server owner. 😭`);
		}

		try {
			const origNickname = args.member.nickname;

			await this.setJarpies(args);
			cleanReply(msg, { embed: this.getJarpyEmbed(msg.member, args.member) });
			
			return this.clearJarpies(msg, args.member, origNickname);
		} catch(err) {
			return sendError(msg, oneLine`I can't jarpy that user. Ask the server's owner to move my role rank up.`);
		}
	}

	clearJarpies(msg, member, origNickname) {
		/**
		* People may spam the jarpy command on a user. Because the original nickname of the user is saved per command
		* call, this could result in the original nickname being overridden with the jarpy version. To stop this, if the
		* beginning and ending of a nickname match the hearts string, don't return the original nickname. The original
		* jarpy command call will take care of that. Doesn't account for the original nickname already matching the
		* hearts string.
		 */
		if(!isJarpyNickname(origNickname)) {
			this.client.setTimeout(() =>
				member.setNickname(origNickname || '')
					.then(() => msg.say(`${member.nickname || member.user.username}'s jarpies have worn off. 💔`))
			, 60000);
		}
	}

	getJarpyEmbed(jarpier, jarpiee) {
		const embed = new Discord.RichEmbed({
			title: '💕💕💕💕💕💕💕💕',
			description: `**${jarpiee} just got jarpied by ${jarpier}!**`,
			thumbnail: { url: 'http://i.imgur.com/qo5bOag.png' }
		});
		embed.setColor('#E494A0');

		return embed;
	}

	getNicknameWithHearts(nickname, hearts) {
		const maxNickLen = 32;
		const numOfSpacesAroundNick = 2;
		const heartsLength = hearts.length * 2;

		if((nickname.length + heartsLength + numOfSpacesAroundNick) > maxNickLen) {
			nickname = nickname.substr(0, (maxNickLen - heartsLength - numOfSpacesAroundNick));
		}

		return `${hearts} ${nickname} ${hearts}`;
	}

	async setJarpies(args) {
		const hearts = '💕';
		let nicknameWithHearts = args.member.nickname || args.member.user.username;

		for(let i = 0; i < args.numOfThrows; i++) {
			nicknameWithHearts = this.getNicknameWithHearts(nicknameWithHearts, hearts);
		}
		
		await args.member.setNickname(nicknameWithHearts);
	}
};
