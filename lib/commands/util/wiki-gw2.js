'use strict';

const WikiBaseCommand = require('../../classes/wiki-base.js');

module.exports = class WikiGW2Command extends WikiBaseCommand {
	constructor(client) {
		super(client, 'gw2', {apiUrl: 'https://wiki.guildwars2.com/api.php'});
	}
};