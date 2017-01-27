'use strict';

const Commando = require('discord.js-commando');
const winston = require('winston');
const Youtube = require('youtube-node');
const alerts = require('../../modules/alerts');
const config = require('../../assets/config.json');

module.exports = class YoutubeCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'youtube',
			aliases: ['yt'],
			group: 'web',
			memberName: 'youtube',
			description: 'Search for videos on Youtube.',
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
		const youtube = new Youtube();
		youtube.setKey(config.tokens.google);

		return youtube.search(query, 1, (err, res) => {
			if(err) {
				winston.error(err);
				return alerts.sendError('Something went wrong when searching for the video.');
			}

			if(res.items.length === 0) {
				return msg.reply('No results for that search.');
			}

			return msg.reply(this.getUrl(res.items[0]));
		});
	}

	getUrl(result) {
		switch(result.id.kind) {
		case 'youtube#playlist':
			return `http://www.youtube.com/playlist?list=${result.id.playlistId}`;
		case 'youtube#video':
			return `http://www.youtube.com/watch?v=${result.id.videoId}`;
		case 'youtube#channel':
			return `http://www.youtube.com/channel/${result.id.channelId}`;
		default:
			return 'No results for that search.';
		}
	}
};
