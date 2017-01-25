'use strict';

const ListRemoveCommand = require('../../modules/list/list-remove.js');

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