'use strict';

const { oneLine, stripIndents } = require('common-tags');
const config = require('../../assets/config.json');
const Discord = require('discord.js');
const htmlToText = require('html-to-text');
const WebCommand = require('../../bases/web');
const wiki = require('wikijs').default;
const winston = require('winston');

module.exports = class WikiCommand extends WebCommand {
	/**
	 * @typedef {Object} WikiOptions
	 * @property {string} [apiUrl = ""]
	 */

	/**
	 * @param {CommandoClient} client
	 * @param {String} [wikiName = ""] - Empty for no wiki name
	 * @param {WikiOptions} [options = {}]
	 */
	constructor(client, wikiName = '', options = {}) {
		const info = { group: 'util' };

		if(wikiName === '') {
			Object.assign(info, {
				name: 'wiki',
				aliases: ['wikipedia'],
				memberName: 'wiki',
				description: 'Search wikipedia.'
			});
		} else {
			Object.assign(info, {
				name: `wiki-${wikiName}`,
				aliases: [`${wikiName}`, `${wikiName}-wiki`],
				group: 'web',
				memberName: `wiki-${wikiName}`,
				description: `Search ${wikiName} wikipedia.`
			});
		}

		super(client, info);
		this.wikiName = wikiName;
		this.options = options;
	}

	/**
	 * @Override
	 */
	async query(msg, args) {
		args = this.toTitleCase(args);

		try {
			const page = await wiki(this.options).page(args);

			if(page.raw.hasOwnProperty('missing')) {
				return await this.getSearchResults(msg, args);
			}

			const img = await this.getImage(args, page);
			const summary = await this.getSummary(page);

			return msg.replyEmbed(
				this.getEmbed(page, summary, img),
				`From the ${this.wikiName ? this.wikiName.toUpperCase() : ''}wiki: <${page.raw.fullurl}>`
			);
		} catch(err) {
			winston.error(err);
			throw new Error(err);
		}
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	toTitleCase(string) {
		return string.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase());
	}

	getEmbed(page, summary, img) {
		const embed = new Discord.RichEmbed({
			title: page.raw.title,
			url: page.raw.fullurl,
			description: summary
		});
		if(img) embed.setThumbnail(img);

		return embed;
	}

	async getImage(searchTerm, page) {
		try {
			return await page.mainImage();
		} catch(e) {
			return this.getImageThatMatchesSearch(searchTerm, page);
		}
	}

	async getImageThatMatchesSearch(searchTerm, page) {
		try {
			const re = new RegExp(this.toWebName(searchTerm), 'i');
			const images = await page.images();

			for(let i = 0; i < images.length; i++) {
				if(images[i] && images[i].match(re)) {
					return images[i];
				}
			}
		} catch(e) {
			winston.error(e);
		}

		return '';
	}

	async getSearchResults(msg, searchTerm) {
		try {
			const delimiter = `\n${config.embed_bullet} `;
			const search = await wiki(this.options).search(searchTerm);

			if(search.results.length === 0) {
				return msg.reply(`The article does not exist.`);
			}

			return msg.reply(stripIndents`
				The article does not exist. Did you perhaps mean one of these?
				${delimiter}${search.results.splice(0, 5).join(delimiter)}
			`);
		} catch(err) {
			const baseUrl = this.options.apiUrl.split('/', 3).join('/');
			winston.warn(err);
			return msg.reply(oneLine`
				An article by that exact name doesn't exist and this wiki doesn't allow bot searches for
				similar matches. Here's a link to manually search it instead:
				${baseUrl}/index.php?title=Special%3ASearch&search=${searchTerm}
			`);
		}
	}

	/**
	 * MediaWikis don't use standards for summaries. At this point, it's necessary to parse the HTML to find the
	 * start of the summary. In most cases, looking for the first occurrence of a <b> or <strong> tag will find
	 * the start of the summary. If there's both tags present, return the one that occurs first.
	 * @param {String} html
	 * @returns {Integer}
	 */
	getSummaryStartInd(html) {
		const strongInd = html.indexOf('<strong');
		const bInd = html.indexOf('<b>');

		if(bInd === -1) return strongInd;
		if(strongInd === -1) return bInd;

		return Math.min(strongInd, bInd);
	}

	async getSummary(page) {
		try {
			const summary = await page.summary();
			if(summary) {
				return this.stripLength(summary);
			}

			let html = await page.html();
			const summaryStartInd = this.getSummaryStartInd(html);
			if(summaryStartInd !== -1) {
				html = html.slice(summaryStartInd);
			}

			html = htmlToText.fromString(html, {
				ignoreHref: true,
				ignoreImage: true,
				wordwrap: false,
				preserveNewlines: true
			});

			if(summaryStartInd !== -1) html = this.capitalizeFirstLetter(html);
			return this.parseEndOfSummary(html);
		} catch(err) {
			throw new Error(err);
		}
	}

	parseEndOfSummary(summary) {
		const contentsSectionInd = summary.indexOf('CONTENTS');
		if(contentsSectionInd !== -1) {
			summary = summary.slice(0, contentsSectionInd);
		} else {
			const nextParagraphInd = summary.indexOf('\n');
			if(nextParagraphInd !== -1) summary = summary.slice(0, nextParagraphInd);
		}

		return this.stripLength(summary);
	}

	stripLength(summary) {
		const contd = '... [continued]';
		const maxLength = 800 - contd.length;

		if(summary.length >= maxLength) {
			summary = `${summary.slice(0, maxLength)}${contd}`;
		}

		return summary;
	}

	toWebName(searchTerm) {
		return searchTerm.replace(/ /g, '_').replace(/'/g, '%27');
	}
};
