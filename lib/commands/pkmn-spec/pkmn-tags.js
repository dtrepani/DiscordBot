'use strict';

const ListTagsCommand = require('../../classes/list-tags.js');

module.exports = class PKMNTagsCommand extends ListTagsCommand {
	constructor(client) {
		super(
			client,
			'pkmn',
			'pkmn-spec'
		);
	}
}