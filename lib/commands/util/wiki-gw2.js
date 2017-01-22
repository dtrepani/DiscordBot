'use strict';

const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const stripIndents = require('common-tags').stripIndents;
const winston = require('winston');
const wiki = require('wikijs').default;
const htmlToText = require('html-to-text');
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
		args = this.toTitleCase(args);

		try {
			const wikiSearch = wiki({apiUrl: 'https://wiki.guildwars2.com/api.php'});
			const page = await wikiSearch.page(args);

			if(page.raw.missing === '') {
				return await this.getSearchResults(msg, args, wikiSearch);
			}

			let html = await page.html();
			const img = await this.getImage(args, page);
			const summary = this.getPlaintextSummary(html);

			msg.delete(2000);
			return msg.replyEmbed(this.getEmbed(page, summary, img));
		} catch(err) {
			winston.error(err);
			return alerts.sendError(msg, err);
		}
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	toTitleCase(string) {
		return string.replace(/\w\S*/g, text => {
			return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
		});
	}

	getEmbed(page, summary, img) {
		if(page.raw) page = page.raw;

		let embed = new Discord.RichEmbed({
			title: page.title,
			url: page.fullurl,
			description: summary
		});
		embed.setColor('#359454');
		if(img) embed.setThumbnail(img);

		return embed;
	}

	async getImage(searchTerm, page) {
		try {
			const re = new RegExp(this.toWebName(searchTerm), 'i');
			const images = await page.images();

			for(let i = 0; i < images.length; i++) {
				if(images[i].match(re)) {
					return images[i];
				}
			}
		} catch(err) {
			return "";
		}

		return "";
	}

	getPlaintextSummary(html) {
		const summaryInd = html.indexOf("<strong");
		if(summaryInd !== -1) html = html.slice(summaryInd);

		html = htmlToText.fromString(html, {
			ignoreHref: true,
			ignoreImage: true,
			wordwrap: false,
			preserveNewlines: true
		});

		if(summaryInd !== -1) html = this.capitalizeFirstLetter(html);
		return this.parseEndOfSummary(html);
	}

	async getSearchResults(msg, searchTerm, wikiSearch) {
		try {
			const delimiter = `\n• `;
			const search = await wikiSearch.search(searchTerm);

			if(search.results.length === 0) {
				return alerts.sendError(msg, `The article does not exist.`);
			}

			return alerts.sendError(msg, stripIndents`
				The article does not exist. Did you perhaps mean one of these?
				${delimiter}${search.results.splice(0, 5).join(delimiter)}
			`);
		} catch (err) {
			throw new Error(err);
		}
	}

	parseEndOfSummary(article) {
		const contd = `... [continued]`;
		const maxLength = 1024 - contd.length; // Embeds cannot exceed 1024 characters

		const contentsSectionInd = article.indexOf("CONTENTS");
		if(contentsSectionInd !== -1) {
			article = article.slice(0, contentsSectionInd);
		} else {
			const nextParagraphInd = article.indexOf("\n");
			if(nextParagraphInd !== -1) article = article.slice(0, nextParagraphInd);
		}

		if(article.length >= maxLength) {
			article = `${article.slice(0, maxLength)}${contd}`;
		}

		return article;
	}

	toWebName(searchTerm) {
		searchTerm = searchTerm.split(' ').join('_');
		searchTerm = searchTerm.split("'").join('%27');

		return searchTerm;
	}
};