'use strict';

const ListTagsCommand = require('../../modules/list/list-tags.js');

module.exports = class TagTagsCommand extends ListTagsCommand {
	constructor(client) {
		super(
			client,
			'tag',
			'tags'
		);
	}
};
