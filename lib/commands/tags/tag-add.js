'use strict';

const ListAddCommand = require('../../classes/list-add.js');

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