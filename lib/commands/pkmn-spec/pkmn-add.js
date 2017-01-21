'use strict';

const ListAddCommand = require('../../classes/list-add.js');

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