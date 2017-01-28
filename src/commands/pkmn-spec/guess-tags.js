'use strict';

const ListTagsCommand = require('../../modules/list/list-tags.js');

module.exports = class GuessTagsCommand extends ListTagsCommand {
	constructor(client) {
		super(
			client,
			'guess',
			'pkmn-spec'
		);
	}
};
