'use strict';

const { oneLine } = require('common-tags');
const ListCommand = require('../../bases/list/list');

module.exports = class TagCommand extends ListCommand {
	constructor(client) {
		super(
			client,
			'tag',
			'tags',
			{ requireItem: true },
			{
				description: `Use a tag, any tag.`,
				details: oneLine`Use the tags command to see a list of currently available tags. Or add your own
					with the add-tag command.`,
				examples: ['tag georgette', `tag where's birdo`]
			}
		);
	}
};
