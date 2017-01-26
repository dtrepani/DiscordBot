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

	async run(msg) {
		const pathName = 'src/assets/8ball.json';
		let answers = [];

		try {
			fs.accessSync(pathName, fs.constants.F_OK);
			answers = JSON.parse(fs.readFileSync(pathName));
		} catch(err) {
			return msg.reply('lol :8ball:');
		}

		const rand = Math.floor(Math.random() * answers.length);
		return msg.reply(`${answers[rand]} :8ball:`);
	}
};
