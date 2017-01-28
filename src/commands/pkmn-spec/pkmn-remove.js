'use strict';

const ListRemoveCommand = require('../../bases/list/list-remove');

module.exports = class PKMNRemoveCommand extends ListRemoveCommand {
	constructor(client) {
		super(
			client,
			'pkmn',
			'pkmn-spec',
			{
				requireOptions: false,
				urlOnly: true
			}
		);
	}
};
