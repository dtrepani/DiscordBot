'use strict';

const ListAddCommand = require('../../bases/list/list-add');

module.exports = class TagAddCommand extends ListAddCommand {
	constructor(client) {
		super(
			client,
			'tag',
			'tags',
			{
				requireOptions: true,
				multipleOptions: false,
				urlOnly: false
			}
		);
	}
};
