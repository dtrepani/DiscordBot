'use strict';

const { charToEmoji } = require('../../modules/string-format');
const { isEmoji } = require('../../modules/type-checks');
const { Command } = require('discord.js-commando');
const sendError = require('../../modules/send-error');

module.exports = class ReactTemplateCommand extends Command {
	constructor(client, commandInfo, parseParamsBehavior) {
		commandInfo = Object.assign({
			group: 'util',
			guildOnly: true
		}, commandInfo);
		super(client, commandInfo);

		this._parseParamsBehavior = parseParamsBehavior;
	}

	/**
	 * @abstract
	 * @param {CommandMessage} msg
	 * @param {*[]} args
	 * @returns {Message}
	 */
	async _getMessageToReactTo(msg, args) {} // eslint-disable-line

	async run(msg, args) {
		try {
			args = this._parseParams(msg, args);
			if(!args.reaction) throw new TypeError('args must contain property "reaction"');

			const msgToReactTo = await this._getMessageToReactTo(msg, args);
			if(!msgToReactTo) {
				throw new Error(
					`No message found matching that description. It may be too far back for me to add reactions to.`
				);
			}
			
			for(let i = 0; i < args.reaction.length; i++) {
				const emojiInfo = this._getEmojiInfo(msg, args.reaction, i);
				i += emojiInfo.nextInd;
				if(emojiInfo.emoji) await msgToReactTo.react(emojiInfo.emoji);
			}
		} catch(err) {
			return sendError(msg, err);
		}

		return msg.delete();
	}

	/**
	 * @param {CommandMessage} msg
	 * @param {string} reaction - Substring of the remaining message
	 * @param {integer} i - Index of spot in reaction
	 * @returns {EmojiInfo}
	 */
	_getEmojiInfo(msg, reaction, i) {
		let emoji = charToEmoji(reaction.substr(i, 1));
		let nextInd = 0;
		
		if(!emoji && i < reaction.length - 1) {
			const twoChars = reaction.substr(i, 2);
			if(isEmoji(twoChars)) {
				emoji = twoChars;
				nextInd++;
			} else if(twoChars === '<:') {
				return this._getCustomEmoji(msg, reaction.substr(i), i);
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
	_getCustomEmoji(msg, reaction, i) {
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

	async _getMessages(msg) {
		return await msg.channel.fetchMessages({ limit: 100 });
	}

	/**
	 * @param {CommandMessage} msg
	 * @param {integer} index - Index of message/how far back from latest message to grab
	 * @param {Collection<Messages>} messages
	 * @returns {Message}
	 */
	async _getMessageFromMessages(msg, index, messages) {
		messages = (await this._removeReactMessages(msg, messages)).array();
		if(messages.length === 0) return null;
		return messages[index];
	}

	/**
	 * Parse parameters and put into appropriate names.
	 * Property that args must always contain, but is not limited to: reaction
	 * @param {CommandMessage} msg
	 * @param {*[]} args
	 * @returns {*[]} Parsed args
	 */
	_parseParams(msg, args) {
		return this._parseParamsBehavior.parseParams(msg, args);
	}

	/**
	 * We don't want to react to the command message or any other react commands.
	 * @param {CommandoMessage} msg
	 * @param {Collection<Messages>} messages
	 * @returns {Collection<Messages>}
	 */
	async _removeReactMessages(msg, messages) {
		return await messages.filter(message => {
			const re = new RegExp(`^${msg.guild.commandPrefix}react.*$`, 'i');
			return !(message.id === msg.id || (message.content && re.test(message.content)));
		});
	}
};
