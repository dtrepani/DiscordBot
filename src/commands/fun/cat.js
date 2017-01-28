'use strict';

const Commando = require('discord.js-commando');
const deleteMsg = require('../../modules/delete-msg');
const request = require('request-promise');

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
		let img = '';
		try {
			const res = await request('http://random.cat/meow');
			img = JSON.parse(res).file;
		} catch(err) {
			img = 'http://i.imgur.com/Bai6JTL.jpg';
		}

		deleteMsg(msg);
		return msg.reply(`\`cat\`: ${img}`);
	}
};
