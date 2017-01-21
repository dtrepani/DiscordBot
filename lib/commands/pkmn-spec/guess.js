'use strict';

const ListCommand = require('../../classes/list.js');

module.exports = class GuessCommand extends ListCommand {
	constructor(client) {
		super(
			client,
			'guess',
			'pkmn-spec',
			{
				requireItem: true
			}
		);
	}

	async run(msg, args) {
		if(args.item.substr(0, 4) === "ill ") {
			args.item = "i'll " + args.item.substr(4);
		}

		return super.run(msg, args);
	}
};