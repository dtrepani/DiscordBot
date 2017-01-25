'use strict';

const EventLog = require('../events/base');
const winston = require('winston');
const fs = require('fs');
const path = require('path');

/**
 * When enabled in a guild, the Logger posts events to the guild's specified channel (#mod-log by default)
 */
module.exports = class Logger {
	/**
	 * @param {CommandoClient} client - The client the command is for
	 * @param {String} dir - Directory for the event objects
	 */
	constructor(client, dir) {
		if(!client) throw new Error('A client must be specified.');
		if(typeof dir !== 'string') throw new TypeError('Directory must be a string.');

		this.client = client;
		this.dir = dir;
		this.registerEvents();
	}

	registerEvents() {
		const wsEventObjs = require('require-all')(this.dir);
		this.wsEvents = [];

		for (const wsEvent of Object.values(wsEventObjs)) {
			this.wsEvents.push(wsEvent);
			this.registerEvent(wsEvent);
		}
	}

	registerEvent(wsEvent) {
		if(typeof wsEvent === 'function') {
			wsEvent = new wsEvent(this.client);
		}

		if (!(wsEvent instanceof EventLog)) {
			winston.warn(`Skipping invalid WSEvent: ${wsEvent}`);
			return;
		}

		if(this.wsEvents.some(anEvent => wsEvent.name === anEvent.name)) {
			throw new Error(`"${wsEvent.name}" is already registered as an event.`);
		}

		this.client.on(wsEvent.name, wsEvent.run);
	}

	reloadEvents() {
		for (let wsEvent in this.wsEvents) {
			if(!wsEvent.name) continue;

			const pathName = path.join(this.dir, `${Logger.camelCaseToDash(wsEvent.name)}.js`);
			if(require.cache[pathName]) delete require.cache[pathName];
		}

		this.registerEvents();
	}

	static camelCaseToDash(str) {
		return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}
};