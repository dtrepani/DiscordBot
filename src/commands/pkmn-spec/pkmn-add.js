'use strict';

const ListAddCommand = require('../../bases/list/list-add');

module.exports = class PKMNAddCommand extends ListAddCommand {
	constructor(client) {
		super(
			client,
			'pkmn',
			'pkmn-spec',
			{
				requireOptions: true,
				multipleOptions: true,
				urlOnly: true
			}
		);
	}
};
