'use strict';

const { Command } = require('discord.js-commando');
const cleanReply = require('../../modules/clean-reply');
const twemoji = require('twemoji');

module.exports = class EmojiCommand extends Command {
	/**
	 * @typedef EmojiInfo
	 * @property {string} img - Image URL
	 * @property {string} baseName - Base name of the custom emoji, if applicable.
	 * 									@example :doge: instead of :doge:276192942710849536
	 */

	constructor(client) {
		super(client, {
			name: 'emoji',
			aliases: ['emojis'],
			group: 'fun',
			memberName: 'emoji',
			description: 'Get a bigger emoji.',
			args: [
				{
					key: 'emoji',
					prompt: 'What emoji?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		let emoji = {
			img: '',
			baseName: ''
		};

		twemoji.parse(args.emoji, {
			callback: (icon, options) => {
				emoji.img = `${options.base}${options.size}/${icon}${options.ext}`;
			}
		});

		if(!emoji.img) emoji = this._parseCustomEmoji(args);

		// Emoji files will be small. Feel free to add as attachment.
		return cleanReply(
			msg, {
				content: emoji.img ? '' : 'No emoji found.',
				argsDisplay: emoji.baseName || ''
			},
			{ file: emoji.img }
		);
	}

	/**
	 * @param {{emoji: string}} args
	 * @returns {EmojiInfo}
	 */
	_parseCustomEmoji(args) {
		const emoji = {
			img: '',
			baseName: ''
		};
		const re = new RegExp('^<(:.+:)(.+)>$');
		const matches = args.emoji.match(re);
		if(matches) {
			emoji.img = `https://cdn.discordapp.com/emojis/${matches[2]}.png`;
			emoji.baseName = matches[1];
		}
		return emoji;
	}
};
