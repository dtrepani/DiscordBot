'use strict';

const { capitalizeFirstLetter, toTitleCase } = require('../../modules/string-format');
const { oneLine, stripIndents } = require('common-tags');
const cleanReply = require('../../modules/clean-reply');
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
		let info = {};

		if(wikiName === '') {
			info = {
				name: 'wiki',
				aliases: ['wikipedia'],
				memberName: 'wiki',
				description: 'Search wikipedia.'
			};
		} else {
			info = {
				name: `wiki-${wikiName}`,
				aliases: [`${wikiName}`, `${wikiName}-wiki`],
				memberName: `wiki-${wikiName}`,
				description: `Search ${wikiName} wikipedia.`
			};
		}

		super(client, info);
		this.wikiName = wikiName;
		this._options = options;
	}

	/**
	 * @Override
	 */
	async _query(msg, args) {
		const query = toTitleCase(args.query);

		try {
			const page = await wiki(this._options).page(query);

			if(page.raw.hasOwnProperty('missing')) {
				return await this._getSearchResults(msg, query);
			}

			const img = await this._getImage(query, page);
			const summary = await this._getSummary(page);

			return cleanReply(msg, {
				embed: this._constructEmbed(page, summary, img),
				content: `<${page.raw.fullurl}>`
			});
		} catch(err) {
			winston.error(err);
			throw new Error(err);
		}
	}

	_constructEmbed(page, summary, img) {
		const embed = new Discord.RichEmbed({
			title: page.raw.title,
			url: page.raw.fullurl,
			description: summary
		});
		if(img) embed.setThumbnail(img);

		return embed;
	}

	async _getImage(searchTerm, page) {
		try {
			return await page.mainImage();
		} catch(err) {
			return this._getImageThatMatchesSearch(searchTerm, page);
		}
	}

	async _getImageThatMatchesSearch(searchTerm, page) {
		try {
			const re = new RegExp(this._toWebName(searchTerm), 'i');
			const images = await page.images();

			for(let i = 0; i < images.length; i++) {
				if(images[i] && images[i].match(re)) {
					return images[i];
				}
			}
		} catch(err) {
			winston.error(err);
		}

		return '';
	}

	async _getSearchResults(msg, searchTerm) {
		try {
			const delimiter = `\n${config.embed_bullet} `;
			const search = await wiki(this._options).search(searchTerm);

			if(search.results.length === 0) {
				return msg.reply(`The article does not exist.`);
			}

			return msg.reply(stripIndents`
				The article does not exist. Did you perhaps mean one of these?
				${delimiter}${search.results.splice(0, 5).join(delimiter)}
			`);
		} catch(err) {
			const baseUrl = this._options.apiUrl.split('/', 3).join('/');
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
	_getSummaryStartInd(html) {
		const strongInd = html.indexOf('<strong');
		const bInd = html.indexOf('<b>');

		if(bInd === -1) return strongInd;
		if(strongInd === -1) return bInd;

		return Math.min(strongInd, bInd);
	}

	async _getSummary(page) {
		try {
			const summary = await page.summary();
			if(summary) {
				return this._stripLength(summary);
			}

			let html = await page.html();
			const summaryStartInd = this._getSummaryStartInd(html);
			if(summaryStartInd !== -1) {
				html = html.slice(summaryStartInd);
			}

			html = htmlToText.fromString(html, {
				ignoreHref: true,
				ignoreImage: true,
				wordwrap: false,
				preserveNewlines: true
			});

			if(summaryStartInd !== -1) html = capitalizeFirstLetter(html);
			return this._parseEndOfSummary(html);
		} catch(err) {
			throw new Error(err);
		}
	}

	_parseEndOfSummary(summary) {
		const contentsSectionInd = summary.indexOf('CONTENTS');
		if(contentsSectionInd !== -1) {
			summary = summary.slice(0, contentsSectionInd);
		} else {
			const nextParagraphInd = summary.indexOf('\n');
			if(nextParagraphInd !== -1) summary = summary.slice(0, nextParagraphInd);
		}

		return this._stripLength(summary);
	}

	_stripLength(summary) {
		const contd = '... [continued]';
		const maxLength = 800 - contd.length;

		if(summary.length >= maxLength) {
			summary = `${summary.slice(0, maxLength)}${contd}`;
		}

		return summary;
	}

	_toWebName(searchTerm) {
		return searchTerm.replace(/ /g, '_').replace(/'/g, '%27');
	}
};
