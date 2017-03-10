'use strict';

const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const sendError = require('../modules/send-error');

module.exports = class ColorTemplateCommand extends Command {
	constructor(client, commandInfo) {
		commandInfo = Object.assign({
			details: oneLine`Available color names: default, aqua, green, blue, purple, pink, yellow, orange, red, grey.
				All colors listed also have a "dark_x" variant, like dark_blue. Hex colors are also available, prefixed
				with "#".`,
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
					type: 'string'
				},
				{
					key: 'forceColor',
					prompt: 'Force your color selection? ',
					type: 'boolean',
					default: false
				}
			]
		}, commandInfo);
		super(client, commandInfo);

		this._colors = {
			DEFAULT: '#000000',
			AQUA: '#1ABC9C',
			GREEN: '#2ECC71',
			BLUE: '#3498DB',
			PURPLE: '#9B59B6',
			PINK: '#E91E63',
			YELLOW: '#F1C40F',
			ORANGE: '#E67E22',
			RED: '#DC3B2B',
			GREY: '#979C9F',
			DARK_GREY: '#607D8B',
			DARK_AQUA: '#11806A',
			DARK_GREEN: '#1F8B4C',
			DARK_BLUE: '#206694',
			DARK_PURPLE: '#71368A',
			DARK_PINK: '#AD1457',
			DARK_YELLOW: '#C27C0E',
			DARK_ORANGE: '#A84300',
			DARK_RED: '#971F13'
		};
	}

	async run(msg, args) {
		try {
			this.checkIfColorIsValid(args);

			if(!this.isHexColor(args.color)) {
				args.color = this._colors[args.color.toUpperCase()];
			}

			const role = await this.getRole(msg, args);
			this.afterRoleHook(msg, args, role);
			return this.setColor(msg, args, role);
		} catch(err) {
			return sendError(msg, err);
		}
	}

	userCanChangeAnyRole(user) {
		return user.permissions.hasPermission('ADMINISTRATOR');
	}

	/**
	 * @abstract
	 * @param {CommandoMessage} msg
	 * @param {*} args
	 * @param {Role} role
	 */
	afterRoleHook(msg, args, role) {} // eslint-disable-line no-unused-vars, no-empty-function

	/**
	 * @abstract
	 * @param {CommandoMessage} msg
	 * @param {*} args
	 * @param {Role} role
	 */
	afterSetColor(msg, args, role) {} // eslint-disable-line no-unused-vars, no-empty-function

	checkIfColorIsValid(args) {
		if(!args.forceColor &&
			!this.isHexColor(args.color) &&
			!this._colors.hasOwnProperty(args.color.toUpperCase())) {
			throw new Error(
				oneLine`\`${args.color}\` is not a valid color. If it's a hex value, make sure it's prefixed with '#'.
					If you're using shorthand hex, please expand it.`
			);
		}
	}

	isHexColor(color) {
		return color.search(/^#[0-9a-f]{6}$/i) !== -1;
	}

	/**
	 * @abstract
	 * @param {CommandoMessage} msg
	 * @param {*} args
	 * @returns {Role} - Role to set the color of
	 */
	async getRole(msg, args) { // eslint-disable-line no-unused-vars
		throw new Error(`${this.constructor.name} doesn't have a getRole() method.`);
	}

	setColor(msg, args, role) {
		if(role.name === '@everyone') {
			throw new Error(`Cannot change the color of the "everyone" role.`);
		}

		return role.setColor(args.color)
			.then(aRole => this.afterSetColor(msg, args, aRole))
			.catch(() => sendError(msg, oneLine`There was a problem setting the color.
				The role given is likely above me so I cannot change its color.
				Contact the server's owner about moving my rank up.`));
	}
};
