'use strict';

const { charToEmoji } = require('../../modules/string-format');
const { isNumber, isEmoji } = require('../../modules/type-checks');
const { Command } = require('discord.js-commando');
const { oneLine, stripIndents } = require('common-tags');
const config = require('../../assets/config.json');
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
			description: `Add reactions to a message.`,
			details: stripIndents`Add reactions to a message. Letters will automatically be converted to emojis.
				${oneLine`Specify how far back the message is you want to react to (with 0 being the latest), 
				either relevant to all messages or to the user to whom you want to react. **See examples.**`}
				Alternatively, supply the message ID (only accessible via developer options).
				${oneLine`For a more precise reaction, you can specify the number of messages back`}`,
			examples: [
				`To react to latest message: \`react :heart:\``,
				`To react to message above latest message: \`react :doge: 1\``,
				`To react to Kyuu's latest message: \`react "love u" 0 @Kyuu#9384\``,
				`To react to Kyuu's fourth (latest + 3) latest message: \`react "love u :heart:" 3 @Kyuu#9384\``,
				`To react using message ID: \`react "love u" 289859024097378304\``
			],
			args: [
				{
					key: 'reaction',
					prompt: 'How would you like to react?',
					type: 'string'
				},
				{
					key: 'msgInfo',
					prompt: oneLine`Which message are you reacting to (0 is the latest)?
						(How many messages back, relevant to all messages or user; or the message ID)`,
					type: 'string',
					default: 0
				},
				{
					key: 'member',
					prompt: 'Which user are you reacting to?',
					type: 'member',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		if(args.msgInfo && !isNumber(args.msgInfo)) {
			return sendError(
				msg,
				new TypeError(oneLine`Please provide a number or message ID. 
					If you did include the number (or just using \`react "reaction here"\`) and are still receiving
					this message, make sure your reaction is wrapped in quotes.`)
			);
		}

		const msgToReactTo = await this.getMessageToReactTo(msg, args);

		if(!msgToReactTo) {
			return sendError(
				msg,
				`No message found matching that description. It may be too far back for me to add reactions to.`
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
	 * @param {CommandMessage} msg
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
	 * @param {CommandMessage} msg
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
		let messages = await msg.channel.fetchMessages({ limit: 100 });

		if(args.msgInfo && args.msgInfo.length === 18) {
			return messages.get(args.msgInfo);
		}

		if(args.member) {
			messages = await messages.filter(message => message.author.id === args.member.id);
		}

		messages = (await this.removeReactMessages(msg, messages)).array();
		if(messages.length === 0) return null;
		return messages[args.msgInfo];
	}

	/**
	 * We don't want to react to the command message or any other react commands.
	 * @param {CommandoMessage} msg
	 * @param {Collection<Messages>} messages
	 * @returns {Collection<Messages>}
	 */
	async removeReactMessages(msg, messages) {
		return await messages.filter(message => {
			const re = new RegExp(`^${msg.guild.commandPrefix}react.*$`, 'i');
			return !(message.id === msg.id || (message.content && re.test(message.content)));
		});
	}
};
