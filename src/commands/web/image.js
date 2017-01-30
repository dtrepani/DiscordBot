'use strict';

const cleanReply = require('../../modules/clean-reply');
const config = require('../../assets/config.json');
const GoogleImages = require('google-images');
const sendError = require('../../modules/send-error');
const WebCommand = require('../../bases/web');
const winston = require('winston');

module.exports = class ImageCommand extends WebCommand {
	constructor(client) {
		super(client, {
			name: 'image',
			aliases: ['google-images', 'google-image', 'img'],
			group: 'web',
			memberName: 'image',
			description: 'Search for an image on Google.',
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
		try {
			const googleImages = new GoogleImages(config.tokens.cse, config.tokens.google);
			const images = await googleImages.search(args.query);

			if(images.length === 0) return cleanReply(msg, 'No results found.');
			return cleanReply(msg, images[Math.floor(Math.random() * images.length)].url);
		} catch(err) {
			winston.error(err);
			return sendError(msg, err);
		}
	}
};
