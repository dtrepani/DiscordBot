'use strict';

const ListRemoveCommand = require('../../bases/list/list-remove');

module.exports = class TagRemoveCommand extends ListRemoveCommand {
	constructor(client) {
		super(
			client,
			'tag',
			'tags',
			{
				requireOptions: false,
				urlOnly: false
			}
		);
	}
};
