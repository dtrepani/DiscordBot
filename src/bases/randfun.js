'use strict';

const Commando = require('discord.js-commando');
const cleanReply = require('../modules/clean-reply');
const request = require('request-promise');
const winston = require('winston');

module.exports = class RandFunCommand extends Commando.Command {
	/**
	 * @param {CommandoClient} client
	 * @param {CommandInfo} commandInfo
	 * @param {String} subreddit - Subreddit to query
	 * @param {String} defaultImg - Image to send on error
	 */
	constructor(client, commandInfo, subreddit, defaultImg) {
		super(client, commandInfo);

		this._randCache = [];
		this._subreddit = subreddit;
		this._defaultImg = defaultImg;
	}

	async run(msg) {
		if(this._randCache.length === 0) {
			try {
				const res = await request(`https://imgur.com/r/${this._subreddit}/hot.json`);
				this._randCache = JSON.parse(res).data;
			} catch(err) {
				winston.warn(`Error when requesting subreddit: ${err}`);
			}
		}

		return cleanReply(msg, this._getRandomImage());
	}

	_getRandomImage() {
		if(this._randCache.length === 0) {
			return this._defaultImg;
		}

		const randImg = this._randCache[Math.floor(Math.random() * this._randCache.length)];
		const extension = randImg.ext.replace(/\?.*/, '');
		return `http://imgur.com/${randImg.hash}${extension}`;
	}
};
