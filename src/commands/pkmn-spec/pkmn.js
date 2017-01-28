'use strict';

const ListCommand = require('../../bases/list/list');

module.exports = class PKMNCommand extends ListCommand {
	constructor(client) {
		super(
			client,
			'pkmn',
			'pkmn-spec',
			{ requireItem: false }
		);
	}
};
