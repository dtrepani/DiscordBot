'use strict';

const config = require('../../assets/config.json');
const Discord = require('discord.js');
const WebCommand = require('../../bases/web');
const winston = require('winston');
const wolfram = require('wolfram-alpha').createClient(config.tokens.wolfram);

module.exports = class WolframCommand extends WebCommand {
	constructor(client) {
		super(client, {
			name: 'wolfram',
			aliases: [
				'wolfram-alpha',
				'wa',
				'math'
			],
			group: 'web',
			memberName: 'wolfram',
			description: 'Search Wolfram|Alpha or solve problems.',
			args: [
				{
					key: 'query',
					prompt: 'What do you want to search for or solve?',
					type: 'string'
				}
			]
		});
	}

	/**
	 * @Override
	 */
	async query(msg, args) {
		const query = args.query;

		return wolfram.query(query, (err, res) => {
			if(err) throw new Error(err);
			if(res.length === 0) return msg.reply(`There were no results for \`${query}\``);

			try {
				const embed = new Discord.RichEmbed();

				res.forEach(item => {
					const title = `${config.embed_prefix} ${item.title}`;
					const text = item.subpods[0].text;
					const img = item.subpods[0].image;

					if(text && this.isNotTooLong(text)) {
						embed.addField(title, text);
					} else if(img) {
						embed.addField(title, img);
						if(!embed.image) embed.setImage(img);
					}
				});

				return msg.replyEmbed(embed, `Results for \`${query}\`:`);
			} catch(anErr) {
				winston.error(anErr);
				throw new Error('Something went wrong when searching.');
			}
		});
	}

	/**
	 * Embed fields cannot exceed 1024 characters.
	 * @param {String} text
	 * @returns {boolean}
	 */
	isNotTooLong(text) {
		return (text.length < 1024);
	}

};
