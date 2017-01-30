'use strict';

const { oneLine } = require('common-tags');
const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const sendError = require('../../modules/send-error');
const winston = require('winston');

module.exports = class SayGuildCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'say-guild',
			group: 'mod',
			memberName: 'say-guild',
			description: 'Speak through Timothy to a specified guild.',
			details: oneLine`Remember that multi-word arguments must be wrapped in quotations. To post to the default
				channel of a guild, use "" as the channel argument. Careful what you say though. 
				Some people can look at who is making Timothy say what. ;)`,
			examples: [
				`~say-guild "Pit of Darkness" "island-of-trash" "Look at me talk!"`,
				`~say-guild KP "" Minimum quotes to the default channel here.`
			],
			args: [
				{
					key: 'guild',
					prompt: 'What guild should I say something on?',
					type: 'string'
				},
				{
					key: 'channel',
					prompt: 'What channel should I say something on?',
					type: 'string'
				},
				{
					key: 'text',
					prompt: 'What would you like me to say?',
					type: 'string'
				}
			]
		});
	}

	hasPermission(msg) {
		return msg.author.id === this.client.options.owner;
	}

	// TODO: support multiple servers with the same name
	// TODO: no talking in guilds the requesting user isn't in (unless user is me)
	async run(msg, args) {
		try {
			const guilds = this.client.guilds;
			const guildMatch = guilds.find(guild => guild.name.toLowerCase() === args.guild.toLowerCase());

			if(!guildMatch) throw new Error(`I'm not a member of the guild **${args.guild}**.`);

			return this._sendToChannel(msg, args, guildMatch);
		} catch(err) {
			return sendError(msg, err);
		}
	}

	_sendToChannel(msg, args, guildMatch) {
		let channel = guildMatch.channels.first();

		if(args.channel) {
			if(args.channel instanceof Discord.Channel) args.channel = args.channel.name;
			channel = guildMatch.channels.find(aChannel => aChannel.name.toLowerCase() === args.channel.toLowerCase());
			if(!channel) throw new Error(`**${args.channel}** is not a valid channel in **${args.guild}**`);
		}

		msg.reply(`I posted the message to **${args.guild}**`).catch(winston.error);
		return guildMatch.channels.first().sendMessage(args.text);
	}
};
