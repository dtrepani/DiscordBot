'use strict';

const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const google = require('google');
const alerts = require('../../modules/alerts');

module.exports = class GoogleCommand extends Commando.Command {
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

	async run(msg, args) {
		const query = args.query;
		google.resultsPerPage = 5;
		const delimiter = `❯ `;

		return google(query, (err, res) => {
			if(err) return alerts.sendError(err);
			const embed = new Discord.RichEmbed({
				title: `Top results for ${query}`,
				url: res.url
			});

			res.links.forEach(result => {
				// "News/Images for $query" have no link.
				if(!result.link) return;

				embed.addField(
					`${delimiter} ${result.title}`,
					stripIndents`
					${result.link}
					${result.description}`
				);
			});

			return msg.replyEmbed(embed, `Top results for \`${query}\`:`);
		});
	}
};
