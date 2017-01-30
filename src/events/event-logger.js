'use strict';

const EventLog = require('./base');
const winston = require('winston');

/**
 * When enabled in a guild, the Logger posts events to the guild's specified channel (#mod-log by default)
 */
module.exports = class EventLogger {
	/**
	 * @param {CommandoClient} client - The client the command is for
	 * @param {String} dir - Directory for the event objects
	 */
	static init(client, dir) {
		const wsEventObjs = require('require-all')(dir);
		const wsEvents = [];

		for(const wsEvent of Object.values(wsEventObjs)) {
			wsEvents.push(wsEvent);
			EventLogger._registerEvent(client, wsEvents, wsEvent);
		}
	}

	static _registerEvent(client, wsEvents, wsEvent) {
		if(typeof wsEvent === 'function') {
			wsEvent = new wsEvent(client); // eslint-disable-line new-cap
		}

		if(!(wsEvent instanceof EventLog)) {
			winston.warn(`Skipping invalid WSEvent: ${wsEvent}`);
			return;
		}

		if(wsEvents.some(anEvent => wsEvent.name === anEvent.name)) {
			throw new Error(`"${wsEvent.name}" is already registered as an event.`);
		}

		wsEvent.register();
	}
};
