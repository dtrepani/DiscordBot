'use strict';

const ListTagsCommand = require('../../bases/list/list-tags');

module.exports = class TagsCommand extends ListTagsCommand {
	constructor(client) {
		super(
			client,
			'tag',
			'tags',
			{},
			{
				name: 'tags',
				aliases: ['tags', 'tag-tags'],
				memberName: 'tags'
			}
		);
	}
};
