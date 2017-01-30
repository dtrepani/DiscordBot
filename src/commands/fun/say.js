'use strict';

const Commando = require('discord.js-commando');
const deleteMsg = require('../../modules/delete-msg');

module.exports = class SayCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'say',
			group: 'fun',
			memberName: 'say',
			description: 'Speak through Timothy.',
			details: `Careful what you say. Some people can look at who is making Timothy say what. ;)`,
			guildOnly: true,
			args: [
				{
					key: 'text',
					prompt: 'What would you like me to say?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		deleteMsg(msg, true, 0);
		msg.say(args.text, { disableEveryone: true });
	}
};
