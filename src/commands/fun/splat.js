'use strict';

const cleanReply = require('../../modules/clean-reply');
const ColorTemplateCommand = require('../../bases/color-template');
const Discord = require('discord.js');
const winston = require('winston');

module.exports = class SplatCommand extends ColorTemplateCommand {
	constructor(client) {
		super(client, {
			name: 'splat',
			aliases: ['splatoon'],
			group: 'fun',
			memberName: 'splat',
			description: `Splat your friends with a color for 30 seconds.`,
			examples: ['splat #ffffff "Role Name Here"']
		});
	}

	/** @override */
	afterRoleHook(msg, args, role) {
		this._prevColor = role.color;
	}

	/** @override */
	afterSetColor(msg, color, role) {
		const that = this;
		cleanReply(msg, { embed: this.getSplatEmbed(msg, color, role) });

		this.client.setTimeout(() => {
			role.setColor(that._prevColor)
				.then(aRole => msg.say(`"${aRole.name}" is back to their original color! 🎉`))
				.catch(winston.error);
		}, 30000);
	}

	getSplatEmbed(msg, color, role) {
		const splatEmbed = new Discord.RichEmbed({
			description: `**${role} was splat by ${msg.member}!**`,
			footer: { text: `${this._prevColor} ➔ ${color}`, icon_url: 'http://i.imgur.com/Nsj5Q24.png' } // eslint-disable-line camelcase, max-len
		});
		splatEmbed.setColor(color);
		return splatEmbed;
	}
};
