'use strict';

const Commando = require('discord.js-commando');
const request = require('request');
const deleteMsg = require('../../modules/delete-msg');

module.exports = class CatCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'cat',
			aliases: ['cats'],
			group: 'fun',
			memberName: 'cat',
			description: 'Cats! So many cats!'
		});
	}

	async run(msg) {
		request('http://random.cat/meow', (err, res, body) => {
			let reply = `http://i.imgur.com/Bai6JTL.jpg`;

			if(!err && res.statusCode === 200) {
				reply = JSON.parse(body).file;
			}

			deleteMsg(msg);
			return msg.reply(`\`cat\`: ${reply}`);
		});
	}
};
