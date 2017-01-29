'use strict';

const { stripIndents } = require('common-tags');
const cleanReply = require('../../modules/clean-reply');
const config = require('../../assets/config.json');
const Discord = require('discord.js');
const google = require('google');
const WebCommand = require('../../bases/web');

module.exports = class GoogleCommand extends WebCommand {
	constructor(client) {
		super(client, {
			name: 'google',
			group: 'web',
			memberName: 'google',
			description: `Google!`,
			args: [
				{
					key: 'query',
					prompt: 'What do you want to search for?',
					type: 'string'
				}
			]
		});
	}

	/**
	 * @Override
	 */
	async _query(msg, args) {
		const query = args.query;
		google.resultsPerPage = 5;

		return google(query, (err, res) => {
			if(err) throw new Error(err);
			const embed = new Discord.RichEmbed({
				title: `Top results for ${query}`,
				url: res.url
			});

			res.links.forEach(result => {
				// "News/Images for $query" have no link.
				if(!result.link) return;

				embed.addField(
					`${config.embed_prefix} ${result.title}`,
					stripIndents`
					${result.link}
					${result.description}`
				);
			});

			return cleanReply(msg, { embed: embed, content: `Top results:` });
		});
	}
};
