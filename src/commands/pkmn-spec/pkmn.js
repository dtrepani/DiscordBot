'use strict';

const { oneLine } = require('common-tags');
const ListCommand = require('../../bases/list/list');

module.exports = class PKMNCommand extends ListCommand {
	constructor(client) {
		super(
			client,
			'pkmn',
			'pkmn-spec',
			{ requireItem: false },
			{
				description: `Get a random image of your favorite people in the world.`,
				details: oneLine`Add a name and get images specifically with that person in it.
					Use the pkmn-tags command to see who's available.`,
				examples: ['pkmn', 'pkmn lhu']
			}
		);
	}
};
