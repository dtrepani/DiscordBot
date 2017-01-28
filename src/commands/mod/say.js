'use strict';

const Commando = require('discord.js-commando');
const winston = require('winston');
const { stripIndents, oneLine } = require('common-tags');
const alerts = require('../../modules/alerts');
const deleteMsg = require('../../modules/delete-msg');

module.exports = class SayCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'say',
			group: 'mod',
			memberName: 'say',
			description: 'Speak through the bot. Message must be wrapped in quotations',
			details: stripIndents`
				Message and guild name must be wrapped in quotations.
				__text:__ Message to say through bot
				__guild:__ Guild/server to say the message to; defaults to current guild
				__channel:__ Channel to say message to; defaults to first channel
			`,
			examples: [
				`~say "I'm saying something!"`,
				`~say ";)" "A Guild Here!" "general"`
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
			return alerts.sendError(msg, oneLine`I'm not a member of the guild \`${args.guild}\`.
				Did you mean for me to say something here instead? Try wrapping your message in quotes.`);
		}

		return this.sendToChannel(msg, args, guildMatch);
	}

	sendToChannel(msg, args, guildMatch) {
		let channel = guildMatch.channels.first();

		if(args.channel) {
			channel = guildMatch.channels.find(aChannel => aChannel.name.toLowerCase() === args.channel.toLowerCase());

			if(!channel) {
				return alerts.sendError(msg, `\`${args.channel}\` is not a valid channel in \`${args.guild}\``);
			}
		}

		msg.reply(`I posted the message to \`${args.guild}\``)
			.catch(winston.error);

		return guildMatch.channels.first().sendMessage(args.text);
	}
};
