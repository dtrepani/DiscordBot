'use strict';

const ListTagsCommand = require('../../classes/list-tags.js');

module.exports = class TagTagsCommand extends ListTagsCommand {
	constructor(client) {
		super(
			client,
			'tag',
			'tags'
		);
	}
}