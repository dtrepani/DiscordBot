'use strict';

const Commando = require('discord.js-commando');
const sendError = require('../../modules/send-error');
const cleanReply = require('../../modules/clean-reply');
const { oneLine } = require('common-tags');

module.exports = class ColorCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'color',
			aliases: ['set-color', 'role-color'],
			group: 'util',
			memberName: 'color',
			description: `Set your role's color.`,
			examples: ['color #ffffff', 'color #ffffff "Role Name Here"'],
			guildOnly: true,
			args: [
				{
					key: 'color',
					prompt: 'What color (hex value only)?',
					type: 'string'
				},
				{
					key: 'roleName',
					prompt: 'Change color for what role?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		if(args.color.search(/^#[0-9a-f]{6}$/i) === -1) {
			return sendError(
				msg,
				oneLine`\`${args.color}\` is not a valid hex value. Make sure your value is prefixed with '#'.
					If you're using shorthand hex, please expand it.`
			);
		}

		const userIsAdmin = msg.member.permissions.hasPermission('ADMINISTRATOR');
		let roles = msg.member.roles;
		let userRoles = `. Your roles: \`${roles.map(aRole => aRole.name).join(', ')}\``;

		if(!args.roleName) {
			if(roles.length > 2) {
				return sendError(msg, `Please specify a role name${userRoles}`);
			}
			return this.setColor(msg, roles.array()[1], args.color);
		}

		if(userIsAdmin) {
			roles = msg.guild.roles;
			userRoles = '';
		}
		const role = roles.find(aRole => aRole.name.toLowerCase() === args.roleName.toLowerCase());

		if(!role) {
			return sendError(
				msg,
				`${args.roleName} is not ${userIsAdmin ? 'a valid role' : 'one of your roles'}${userRoles}`
			);
		}

		return this.setColor(msg, role, args.color);
	}

	setColor(msg, role, color) {
		if(role.name === '@everyone') {
			return sendError(msg, `Cannot change the color of the @everyone role.`);
		}

		return role.setColor(color)
			.then(aRole => cleanReply(msg, `Role "${aRole.name}" set to color ${color}`))
			// eslint-disable-next-line handle-callback-err, no-unused-vars
			.catch(err => sendError(msg, oneLine`That role is above me so I cannot change its color.
					Contact the server's owner about moving my rank up.`));
	}
};
