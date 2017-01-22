'use strict';

const ListAddCommand = require('../../classes/list-add.js');

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