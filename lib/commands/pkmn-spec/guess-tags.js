'use strict';

const ListTagsCommand = require('../../classes/list-tags.js');

module.exports = class GuessTagsCommand extends ListTagsCommand {
	constructor(client) {
		super(
			client,
			'guess',
			'pkmn-spec'
		);
	}
};