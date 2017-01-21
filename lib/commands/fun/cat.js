'use strict';

const Commando = require('discord.js-commando');
const request = require('request');

module.exports = class CatCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'cat',
			aliases: ['cats'],
			group: 'fun',
			memberName: 'cat',
			description: 'Cats! So many cats!',
			guildOnly: true
		});
	}

	async run(msg, args) {
		request('http://random.cat/meow', (err, res, body) => {
			let reply = `http://i.imgur.com/Bai6JTL.jpg`;

			if (!err && res.statusCode === 200) {
				reply = JSON.parse(body).file;
			}

			msg.delete(2000);
			return msg.reply(`\`cat\`: ${reply}`);
		});
	}
};