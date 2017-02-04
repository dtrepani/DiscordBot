'use strict';

const RandFunCommand = require('../../bases/randfun');

module.exports = class SnekCommand extends RandFunCommand {
	constructor(client) {
		super(
			client,
			{
				name: 'snek',
				aliases: ['sneks', 'snake', 'snakes'],
				group: 'fun',
				memberName: 'snek',
				description: 'Hissssssssssss'
			},
			'sneks',
			'http://i.imgur.com/OgQx3QK.gifv'
		);
	}
};
