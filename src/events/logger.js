'use strict';

const { camelCaseToDash } = require('../modules/string-format');
const EventLog = require('./base');
const path = require('path');
const winston = require('winston');

/**
 * When enabled in a guild, the Logger posts events to the guild's specified channel (#mod-log by default)
 */
module.exports = class Logger {
    /**
     * @param {CommandoClient} client - The client the command is for
     * @param {String} dir - Directory for the event objects
     */
	constructor(client, dir) {
		this.client = client;
		this.dir = dir;
		this.registerEvents();
	}

	registerEvents() {
		const wsEventObjs = require('require-all')(this.dir);
		this.wsEvents = [];

		for(const wsEvent of Object.values(wsEventObjs)) {
			this.wsEvents.push(wsEvent);
			this._registerEvent(wsEvent);
		}
	}

	_registerEvent(wsEvent) {
		if(typeof wsEvent === 'function') {
			wsEvent = new wsEvent(this.client); // eslint-disable-line new-cap
		}

		if(!(wsEvent instanceof EventLog)) {
			winston.warn(`Skipping invalid WSEvent: ${wsEvent}`);
			return;
		}

		if(this.wsEvents.some(anEvent => wsEvent.name === anEvent.name)) {
			throw new Error(`"${wsEvent.name}" is already registered as an event.`);
		}

		wsEvent.register();
	}

	reloadEvents() {
		for(const wsEvent in this.wsEvents) {
			if(!wsEvent.name) {
				continue;
			}

			const pathName = path.join(this.dir, `${camelCaseToDash(wsEvent.name)}.js`);
			if(require.cache[pathName]) {
				delete require.cache[pathName];
			}
		}

		this.registerEvents();
	}
};
