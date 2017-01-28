'use strict';

const ListCommand = require('../../modules/list/list.js');

module.exports = class HickoryCommand extends ListCommand {
	constructor(client) {
		super(
			client,
			'hickory',
			'pkmn-spec',
			{ requireItem: false }
		);
	}
};
