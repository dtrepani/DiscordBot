'use strict';

const { oneLine } = require('common-tags');
const Commando = require('discord.js-commando');
const deleteMsg = require('../../modules/delete-msg');
const sendError = require('../../modules/send-error');
const winston = require('winston');

module.exports = class SayCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'say',
			group: 'mod',
			memberName: 'say',
			description: 'Speak through Timothy.',
			details: oneLine`Remember that multi-word arguments must be wrapped in quotations. 
				Careful what you say though. Some people can look at who is making Timothy say what. ;)`,
			examples: [
				`~say "I'm saying something!"`,
				`~say ";)" "Pit of Darkness" "island-of-trash"`
			],

			args: [
				{
					key: 'text',
					prompt: 'What would you like me to say?',
					type: 'string'
				},
				{
					key: 'guild',
					prompt: 'What guild should I say something on?',
					type: 'string',
					default: ''
				},
				{
					key: 'channel',
					prompt: 'What channel should I say something on?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	// TODO: support multiple servers with the same name
	// TODO: no talking in guilds the requesting user isn't in
	async run(msg, args) {
		if(!args.guild) {
			deleteMsg(msg, true, 0);
			return msg.say(args.text, {});
		}

		const guilds = this.client.guilds;
		const guildMatch = guilds.find(guild => guild.name.toLowerCase() === args.guild.toLowerCase());

		if(!guildMatch) {
			return sendError(msg, oneLine`I'm not a member of the guild **${args.guild}**.
				Did you mean for me to say something here instead? Try wrapping your message in quotes.`);
		}

		return this._sendToChannel(msg, args, guildMatch);
	}

	_sendToChannel(msg, args, guildMatch) {
		let channel = guildMatch.channels.first();

		if(args.channel) {
			channel = guildMatch.channels.find(aChannel => aChannel.name.toLowerCase() === args.channel.toLowerCase());

			if(!channel) {
				return sendError(msg, `**${args.channel}** is not a valid channel in **${args.guild}**`);
			}
		}

		msg.reply(`I posted the message to **${args.guild}**`)
			.catch(winston.error);

		return guildMatch.channels.first().sendMessage(args.text);
	}
};
