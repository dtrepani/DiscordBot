'use strict';

const Commando = require('discord.js-commando');
const deleteMsg = require('../modules/delete-msg');
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

		this.randCache = [];
		this.name = commandInfo.name;
		this.subreddit = subreddit;
		this.defaultImg = defaultImg;
	}

	async run(msg) {
		if(this.randCache.length === 0) {
			try {
				const res = await request(`https://imgur.com/r/${this.subreddit}/hot.json`);
				this.randCache = JSON.parse(res).data;
			} catch(err) {
				winston.warn(`Error when requesting subreddit: ${err}`);
			}
		}

		deleteMsg(msg);
		return msg.reply(`\`${this.name}\`: ${this.getRandomImage()}`);
	}

	getRandomImage() {
		if(this.randCache.length === 0) {
			return this.defaultImg;
		}

		const randImg = this.randCache[Math.floor(Math.random() * this.randCache.length)];
		const extension = randImg.ext.replace(/\?.*/, '');
		return `http://imgur.com/${randImg.hash}${extension}`;
	}
};
