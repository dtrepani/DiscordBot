'use strict';

const WikiBaseCommand = require('../../classes/wiki-base.js');

module.exports = class WikiBDOCommand extends WikiBaseCommand {
	constructor(client) {
		super(client, 'bdo', {apiUrl: 'https://blackdesert.wikia.com/api.php'});
	}
};