'use strict';

const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const sendError = require('../modules/send-error');

module.exports = class ColorTemplateCommand extends Command {
	constructor(client, commandInfo) {
		commandInfo = Object.assign({
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
	}

	async run(msg, args) {
		try {
			this.checkIfColorIsHex(args);

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

	checkIfColorIsHex(args) {
		if(!args.forceColor && args.color.search(/^#[0-9a-f]{6}$/i) === -1) {
			throw new Error(
				oneLine`\`${args.color}\` is not a valid hex value. Make sure your value is prefixed with '#'.
					If you're using shorthand hex, please expand it.`
			);
		}
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
			// eslint-disable-next-line handle-callback-err, no-unused-vars
			.catch(err => sendError(msg, oneLine`There was a problem setting the color.
				The role given is likely above me so I cannot change its color.
				Contact the server's owner about moving my rank up.`));
	}
};
