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
			examples: ['color #ffffff', 'color #ffffff "Role Name Here"', 'color blue']
		});
	}

	/** @override */
	async getRole(msg, args) {
		const useAllRoles = this.userCanChangeAnyRole(msg.member);
		const roles = useAllRoles ? msg.guild.roles : msg.member.roles;
		const role = roles.find(aRole => aRole.name.toLowerCase() === args.roleName.toLowerCase());

		if(!role) {
			throw new Error(
				`"${args.roleName}" is not ${useAllRoles
					? 'a valid role'
					: `one of your roles. Your roles: \`${roles.map(aRole => aRole.name).join(', ')}\``}`
			);
		}
		return role;
	}

	/** @override */
	afterSetColor(msg, args, role) {
		const colorEmbed = new Discord.RichEmbed(
			{ description: `Role "${role.name}" was set to color ${args.color} 🎨` }
		);
		colorEmbed.setColor(args.color);
		return cleanReply(msg, { embed: colorEmbed });
	}
};
