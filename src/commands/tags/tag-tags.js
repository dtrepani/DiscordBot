'use strict';

const ListTagsCommand = require('../../bases/list/list-tags');

module.exports = class TagTagsCommand extends ListTagsCommand {
	constructor(client) {
		super(
			client,
			'tag',
			'tags'
		);
	}
};
