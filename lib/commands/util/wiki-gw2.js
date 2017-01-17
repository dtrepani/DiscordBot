'use strict';

const Commando = require('discord.js-commando');
const winston = require('winston');
const Wiki = require('nodemw');
const alerts = require('../../modules/alerts');

module.exports = class WikiGW2Command extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'wiki-gw2',
			aliases: ['wikigw2', 'gw2', 'gw2wiki', 'gw2-wiki'],
			group: 'util',
			memberName: 'wiki-gw2',
			description: 'Query the GW2 wikipedia page.'
		});
	}

	async run(msg, args) {
		let wiki = new Wiki({
			server: 'wiki.guildwars2.com',
			path: '',
			//debug: true
		});

		return wiki.getArticle(args,
			(err, data) => {
				if (err) {
					winston.error(err);
					// return alerts.sendError(err);
				}

				return msg.reply(data);
			});
	}
};