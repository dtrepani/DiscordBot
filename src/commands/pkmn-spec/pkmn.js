'use strict';

const ListCommand = require('../../modules/list/list.js');

module.exports = class PKMNCommand extends ListCommand {
	constructor(client) {
		super(
			client,
			'pkmn',
			'pkmn-spec',
			{
				requireItem: false
			}
		);
	}
};