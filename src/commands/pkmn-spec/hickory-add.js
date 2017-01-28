'use strict';

const ListAddCommand = require('../../modules/list/list-add.js');

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
