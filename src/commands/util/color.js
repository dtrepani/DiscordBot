'use strict';

const cleanReply = require('../../modules/clean-reply');
const ColorTemplateCommand = require('../../bases/color-template');
const Discord = require('discord.js');

module.exports = class ColorCommand extends ColorTemplateCommand {
	constructor(client) {
		super(client, {
			name: 'color',
			aliases: ['set-color', 'role-color'],
			group: 'util',
			memberName: 'color',
			description: `Set your role's color.`,
			examples: ['color #ffffff', 'color #ffffff "Role Name Here"']
		});
	}

	/** @override */
	afterSetColor(msg, color, role) {
		const colorEmbed = new Discord.RichEmbed({ description: `Role "${role.name}" was set to color ${color} 🎨` });
		colorEmbed.setColor(color);
		return cleanReply(msg, { embed: colorEmbed });
	}
};
