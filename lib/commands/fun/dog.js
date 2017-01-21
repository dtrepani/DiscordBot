'use strict';

const Commando = require('discord.js-commando');
const randomPuppy = require('random-puppy');

module.exports = class DogCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'dog',
			aliases: ['dogs'],
			group: 'fun',
			memberName: 'dog',
			description: 'wow such doge much want',
			guildOnly: true
		});
	}

	async run(msg, args) {
		randomPuppy().then(res => {
			msg.delete(2000);
			return msg.reply(`\`dog\`: ${res}`);
		});
	}
};