'use strict';

const ListTagsCommand = require('../../bases/list/list-tags');

module.exports = class PKMNTagsCommand extends ListTagsCommand {
	constructor(client) {
		super(
			client,
			'pkmn',
			'pkmn-spec'
		);
	}
};
