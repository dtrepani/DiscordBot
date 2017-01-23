'use strict';

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
};