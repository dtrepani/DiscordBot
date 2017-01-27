'use strict';

const WikiCommand = require('./wiki.js');

module.exports = class WikiGW2Command extends WikiCommand {
	constructor(client) {
		super(client, 'gw2', { apiUrl: 'https://wiki.guildwars2.com/api.php' });
	}
};
