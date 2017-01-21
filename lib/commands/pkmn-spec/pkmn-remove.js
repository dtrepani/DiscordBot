'use strict';

const ListRemoveCommand = require('../../classes/list-remove.js');

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