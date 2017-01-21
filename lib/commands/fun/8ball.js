'use strict';

const Commando = require('discord.js-commando');
const fs = require('fs');

module.exports = class EightBallCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: '8ball',
			aliases: ['8-ball', 'eight-ball'],
			group: 'fun',
			memberName: '8ball',
			description: `Find out the answer to life's many questions.`,
			args: [
				{
					key: 'question',
					prompt: 'What question would you like to ask?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const path = `lib/assets/8ball.json`;
		let answers = [];

		try {
			fs.accessSync(path, fs.constants.F_OK);
			answers = JSON.parse(fs.readFileSync(path));
		} catch(err) {
			return msg.reply(`:8ball: lol :8ball:`);
		}

		const rand = Math.floor(Math.random() * answers.length);
		return msg.reply(`:8ball: ${answers[rand]} :8ball:`);
	}
};