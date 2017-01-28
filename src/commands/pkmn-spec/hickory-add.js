'use strict';

const ListAddCommand = require('../../bases/list/list-add');

module.exports = class HickoryAddCommand extends ListAddCommand {
	constructor(client) {
		super(
			client,
			'hickory',
			'pkmn-spec',
			{
				requireOptions: false,
				multipleOptions: false,
				urlOnly: true
			}
		);
	}
};
