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
			examples: ['splat #ffffff "Role Name Here"'],
			args: [
				{
					key: 'color',
					prompt: 'What color (hex value only)?',
					type: 'string'
				},
				{
					key: 'member',
					prompt: 'Splat which user?',
					type: 'member'
				},
				{
					key: 'forceColor',
					prompt: 'Force your color selection? ',
					type: 'boolean',
					default: false
				}
			]
		});
	}

	/** @override */
	async getRole(msg, args) {
		const user = args.member.user;
		this._roleName = `Splat ${user.username}#${user.discriminator}`;
		const guild = msg.guild;
		let role = guild.roles.find('name', this._roleName);

		if(!role) {
			role = await guild.createRole({ name: this._roleName });
			const rolePos = guild.member(this.client.user).highestRole.position - 1;
			if(rolePos > role.position) {
				// TODO: NEVER use a spinlock. Except when role position refuses to take due to bugged code in library.
				// This is such a bad idea.
				while(rolePos !== role.position) {
					role = await role.setPosition(rolePos);
				}
			}
		}
		
		args.member.addRole(role);
		return role;
	}

	/** @override */
	afterSetColor(msg, args, role) {
		cleanReply(msg, { embed: this.getSplatEmbed(msg, args) });

		this.client.setTimeout(() => {
			role.delete()
				.then(() => msg.say(
					`${args.member.nickname || args.member.user.username} is back to their original color! 🎉`)
				)
				.catch(winston.error);
		}, 30000);
	}

	getSplatEmbed(msg, args) {
		const splatEmbed = new Discord.RichEmbed({
			title: 'SPLAT!',
			description: `**${args.member} was splat by ${msg.member}!**`,
			thumbnail: { url: 'http://i.imgur.com/Nsj5Q24.png' }
		});
		splatEmbed.setColor(args.color);
		return splatEmbed;
	}
	
	/** @override */
	userCanChangeAnyRole(user) { // eslint-disable-line no-unused-vars
		return true;
	}
};
