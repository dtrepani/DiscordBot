'use strict';

const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const cleanReply = require('../../modules/clean-reply');
const Discord = require('discord.js');
const sendError = require('../../modules/send-error');
const winston = require('winston');

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
			const hearts = '💕';

			this.setJarpies(args, hearts);
			cleanReply(msg, { embed: this.getJarpyEmbed(msg.member, args.member) });
			
			return this.clearJarpies(msg, args.member, origNickname, hearts);
		} catch(err) {
			winston.error(err);
			return sendError(msg, oneLine`I can't jarpy that user. 
				Ask the server's owner to move my role rank up. If you're trying to jarpy the server owner,
				I'm unable to do that no matter what.`);
		}
	}

	clearJarpies(msg, member, origNickname, hearts) {
		if(!this.userWasAlreadyJarpied(origNickname, hearts)) {
			this.client.setTimeout(() =>
				member.setNickname(origNickname || '')
					.then(() => msg.say(`${member.nickname || member.user.username}'s jarpies have worn off. 💔`))
					.catch(winston.error)
			, 60000);
		}
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

	getJarpyEmbed(jarpier, jarpiee) {
		const embed = new Discord.RichEmbed({
			title: '💕💕💕💕💕💕💕💕',
			description: `**${jarpiee} just got jarpied by ${jarpier}!**`,
			thumbnail: { url: 'http://i.imgur.com/qo5bOag.png' }
		});
		embed.setColor('#E494A0');

		return embed;
	}

	setJarpies(args, hearts) {
		let nicknameWithHearts = args.member.nickname || args.member.user.username;

		for(let i = 0; i < args.numOfThrows; i++) {
			nicknameWithHearts = this.getNicknameWithHearts(nicknameWithHearts, hearts);
		}
		
		args.member.setNickname(nicknameWithHearts);
	}

	/**
	 * People may spam the jarpy command on a user. Because the original nickname of the user is saved per command call,
	 * this could result in the original nickname being overridden with the jarpy version. To stop this, if the
	 * beginning and ending of a nickname match the hearts string, don't return the original nickname. The original
	 * jarpy command call will take care of that. Doesn't account for the original nickname already matching the hearts
	 * string.
	 * @param {string} nickname
	 * @param {string} hearts
	 * @returns {boolean}
	 */
	userWasAlreadyJarpied(nickname, hearts) {
		if(!nickname) {
			return false;
		}

		// +1 accounts for the space on either side of the nickname.
		const heartsLength = hearts.length + 1;

		const startOfNick = nickname.substr(0, heartsLength);
		const endOfNick = nickname.substr(nickname.length - heartsLength);

		return (startOfNick === `${hearts} ` && endOfNick === ` ${hearts}`);
	}
};
