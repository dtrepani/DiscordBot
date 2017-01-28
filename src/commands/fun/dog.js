'use strict';

const RandFunCommand = require('../../bases/randfun');

module.exports = class DogCommand extends RandFunCommand {
	constructor(client) {
		super(
			client,
			{
				name: 'dog',
				aliases: ['dogs'],
				group: 'fun',
				memberName: 'dog',
				description: 'wow such doge much want'
			},
			'dogpictures',
			'https://i.imgur.com/3cZP8w5.jpg'
		);
	}
};
