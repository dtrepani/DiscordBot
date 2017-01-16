'use strict';

const Discord = require('discord.js');
const Commando = require('discord.js-commando');

module.exports = {
	sendError: (msg, err) => {
		const embed = new Discord.RichEmbed()
			.setTitle('An Error Occurred')
			.setColor('#CE1616')
			.setDescription(err);

		return msg.replyEmbed(
			embed,
			':no_entry_sign:'
		);
	},
	getHelpEmbed: (title) => {
		return new Discord.RichEmbed()
			.setTitle(title)
			.setColor('#00AE86');
	},
	sendHelp: (msg, embed) => {
		return msg.replyEmbed(
			embed,
			'help is here!'
		);
	}
};