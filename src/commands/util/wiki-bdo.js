'use strict';

const WikiCommand = require('./wiki.js');

module.exports = class WikiBDOCommand extends WikiCommand {
	constructor(client) {
		super(client, 'bdo', { apiUrl: 'https://blackdesert.wikia.com/api.php' });
	}
};
