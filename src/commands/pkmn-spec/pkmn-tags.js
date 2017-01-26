'use strict';

const ListTagsCommand = require('../../modules/list/list-tags.js');

module.exports = class PKMNTagsCommand extends ListTagsCommand {
	constructor(client) {
		super(
			client,
			'pkmn',
			'pkmn-spec'
		);
	}
};
