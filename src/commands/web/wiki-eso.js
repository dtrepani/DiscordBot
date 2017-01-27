'use strict';

const WikiCommand = require('./wiki.js');

module.exports = class WikiESOCommand extends WikiCommand {
	constructor(client) {
		super(client, 'eso', { apiUrl: 'https://elderscrolls.wikia.com/api.php' });
	}
};
