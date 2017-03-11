'use strict';

const { charToEmoji } = require('../../modules/string-format');
const { isEmoji } = require('../../modules/type-checks');
const { Command } = require('discord.js-commando');
const cleanReply = require('../../modules/clean-reply');
const sendError = require('../../modules/send-error');
const winston = require('winston');

module.exports = class ReactCommand extends Command {
	/**
	 * @typedef {Object} EmojiInfo
	 * @property {?string} emoji - Emoji found, if any
	 * @property {integer} nextInd - Next index to proceed from. Reaction string may contain custom emojis or unicode
	 * 								emojis, which require some index to be skipped as they are part of them.
	 */

	constructor(client) {
		super(client, {
			name: 'react',
			group: 'util',
			memberName: 'react',
			description: `Add reactions to a message. Don't use if you don't know how to get message IDs.`,
			examples: ['react 289859024097378304 nerd pls'],
			args: [
				{
					key: 'msgID',
					prompt: 'What message would you like to react to (ID)?',
					type: 'string'
				},
				{
					key: 'reaction',
					prompt: 'How would you like to react?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const msgToReactTo = await this.getMessageToReactTo(msg, args);

		if(!msgToReactTo) {
			return sendError(
				msg,
				`I couldn't find a message with that ID. It may be too far back for me to add reactions to.`
			);
		}

		try {
			for(let i = 0; i < args.reaction.length; i++) {
				const emojiInfo = this.getEmojiInfo(msg, args.reaction, i);
				i += emojiInfo.nextInd;
				if(emojiInfo.emoji) await msgToReactTo.react(emojiInfo.emoji);
			}
		} catch(err) {
			winston.error(err);
			return sendError(msg, 'Something went wrong.');
		}

		return msg.delete();
	}

	/**
	 * @param {CommandoMessage} msg
	 * @param {string} reaction - Substring of the remaining message
	 * @param {integer} i - Index of spot in reaction
	 * @returns {EmojiInfo}
	 */
	getEmojiInfo(msg, reaction, i) {
		let emoji = charToEmoji(reaction.substr(i, 1));
		let nextInd = 0;
		
		if(!emoji && i < reaction.length - 1) {
			const twoChars = reaction.substr(i, 2);
			if(isEmoji(twoChars)) {
				emoji = twoChars;
				nextInd++;
			} else if(twoChars === '<:') {
				return this.getCustomEmoji(msg, reaction.substr(i), i);
			}
		}

		return { emoji: emoji, nextInd: nextInd };
	}

	/**
	 * @param {CommandoMessage} msg
	 * @param {string} reaction - Substring of the remaining message
	 * @param {integer} i - Index of spot in reaction
	 * @returns {EmojiInfo}
	 */
	getCustomEmoji(msg, reaction, i) {
		const re = new RegExp('^<:[a-zA-Z_]+:([0-9]+)>', 'i');
		const matches = reaction.match(re);
		if(matches) {
			const guildEmojis = msg.guild.emojis;
			const customEmojiID = matches[1];
			const emoji = guildEmojis.get(customEmojiID);
			if(emoji) return { emoji: emoji, nextInd: reaction.indexOf('>') };
		}

		return { emoji: '', nextInd: i };
	}

	async getMessageToReactTo(msg, args) {
		const messages = await msg.channel.fetchMessages({ limit: 30 });
		return messages.get(args.msgID);
	}
};
