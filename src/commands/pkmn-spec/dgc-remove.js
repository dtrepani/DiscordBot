'use strict';

const ListRemoveCommand = require('../../bases/list/list-remove');

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
