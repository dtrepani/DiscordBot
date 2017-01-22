'use strict';

const WikiBaseCommand = require('../../classes/wiki-base.js');

module.exports = class WikiESOCommand extends WikiBaseCommand {
	constructor(client) {
		super(client, 'eso', {apiUrl: 'https://elderscrolls.wikia.com/api.php'});
	}
};