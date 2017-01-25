'use strict';

module.exports = class EventLog {
	/**
	 * @typedef {Object} RichEmbed
	 * @see {@link https://discord.js.org/#/docs/main/stable/class/RichEmbed}
	 */

	/**
	 * @typedef {Object} GuildChannel
	 * @see {@link https://discord.js.org/#/docs/main/stable/class/GuildChannel}
	 */

	/**
	 * @typedef {Object} EventInfo
	 * @property {String} name - WSEventType name in camelCase.
	 * @see {@link https://discord.js.org/#/docs/main/stable/typedef/WSEventType}
	 */

	/**
	 * @param {CommandoClient} client - The client the event is for
	 * @param {EventInfo} info - The event information
	 */
	constructor(client, info) {
		if(!client) throw new Error('A client must be specified.');
		if(typeof info.name !== 'string') throw new TypeError('Event name must be a string.');

		this.client = client;
		Object.defineProperty(this, 'name', { value: info.name });
	}

	/**
	 * Function to run when the event is triggered.
	 */
	run(...args) {
		throw new Error(`${this.constructor.name} doesn't have a run() method.`);
	}

	/**
	 * @param {GuildMember} member
	 */
	static getVoiceChannel(member) {
		return member.guild.channels.get(member.voiceChannelID);
	}
};