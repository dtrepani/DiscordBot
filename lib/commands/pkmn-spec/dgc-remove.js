'use strict';

const alerts = require('../../modules/alerts');
const stripIndents = require('common-tags').stripIndents;
const ListRemoveCommand = require('../../classes/list-remove.js');

module.exports = class DGCRemoveCommand extends ListRemoveCommand {
	constructor(client) {
		super(
			client,
			'dgc',
			'pkmn-spec',
			{
				requireOptions: false,
				urlOnly: true
			}
		);
	}

	// TODO: check both echium and dgc lists for url
};