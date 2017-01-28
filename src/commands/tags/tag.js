'use strict';

const ListCommand = require('../../bases/list/list');

module.exports = class TagCommand extends ListCommand {
	constructor(client) {
		super(
			client,
			'tag',
			'tags',
			{ requireItem: true }
		);
	}
};
