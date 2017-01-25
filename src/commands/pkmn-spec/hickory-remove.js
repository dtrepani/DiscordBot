'use strict';

const ListRemoveCommand = require('../../modules/list/list-remove.js');

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