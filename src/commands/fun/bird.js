'use strict';

const RandFunCommand = require('../../bases/randfun');

module.exports = class BirdCommand extends RandFunCommand {
	constructor(client) {
		super(
			client,
			{
				name: 'bird',
				aliases: ['birds', 'birb', 'birb'],
				group: 'fun',
				memberName: 'bird',
				description: 'Birb!!!!!!'
			},
			'birbs',
			'http://i.imgur.com/Fj6YtQY.gifv'
		);
	}
};
