'use strict';

const ListRemoveCommand = require('../../bases/list/list-remove');

module.exports = class HickoryRemoveCommand extends ListRemoveCommand {
	constructor(client) {
		super(
			client,
			'hickory',
			'pkmn-spec',
			{
				requireOptions: false,
				urlOnly: true
			}
		);
	}
};
