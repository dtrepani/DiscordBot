'use strict';

const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const winston = require('winston');
const stripIndents = require('common-tags').stripIndents;
const alerts = require('../../modules/alerts');

module.exports = class SayCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'say',
			group: 'mod',
			memberName: 'say',
			description: stripIndents`
				Speak through the bot. Message and guild name must be wrapped in quotations.
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
			msg.delete();
			return msg.say(args.text, {});
		}

		const guilds = this.client.guilds;
		const guildMatch = guilds.find(val => val.name.toLowerCase() == args.guild.toLowerCase());

		if(!guildMatch) {
			return alerts.sendError(msg, `I'm not a member of the guild \`${args.guild}\`.`);
		}

		return this.sendToChannel(msg, args, guildMatch);
	}

	sendToChannel(msg, args, guildMatch) {
		let channel = guildMatch.channels.first();

		if(args.channel) {
			channel = guildMatch.channels.find(val => val.name.toLowerCase() == args.channel.toLowerCase());

			if(!channel) {
				return alerts.sendError(msg, `\`${args.channel}\` is not a valid channel in \`${args.guild}\``);
			}
		}

		msg.reply(`I posted the message to \`${args.guild}\``)
			.catch(winston.error);

		return guildMatch.channels.first().sendMessage(args.text);
	}
};