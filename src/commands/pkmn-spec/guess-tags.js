'use strict';

const ListTagsCommand = require('../../bases/list/list-tags');

module.exports = class GuessTagsCommand extends ListTagsCommand {
	constructor(client) {
		super(
			client,
			'guess',
			'pkmn-spec'
		);
	}
};
