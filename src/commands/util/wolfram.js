'use strict';

const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const winston = require('winston');
const alerts = require('../../modules/alerts');
const config = require('../../assets/config.json');
const wolfram = require('wolfram-alpha').createClient(config.tokens.wolfram);

module.exports = class WolframCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'wolfram',
			aliases: [
				'wolfram-alpha',
				'wa',
				'math'
			],
			group: 'util',
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

	async run(msg, args) {
		const query = args.query;
		const delimiter = `❯ `;

		return wolfram.query(query, (err, res) => {
			if(err) throw new Error(err);
			if(res.length === 0) return msg.reply(`There were no results for \`${query}\``);

			try {
				const embed = new Discord.RichEmbed();

				res.forEach(item => {
					const title = `${delimiter}${item.title}`;
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
			} catch(e) {
				winston.error(e);
				return alerts.sendError(msg, 'Something went wrong when searching.');
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
