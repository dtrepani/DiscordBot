'use strict';

const ListCommand = require('../../bases/list/list');

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
