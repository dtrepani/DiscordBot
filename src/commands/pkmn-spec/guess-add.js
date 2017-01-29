'use strict';

const ListAddCommand = require('../../bases/list/list-add');
const sendError = require('../../modules/send-error');
const stripIndents = require('common-tags').stripIndents;

module.exports = class GuessAddCommand extends ListAddCommand {
	constructor(client) {
		super(
			client,
			'guess',
			'pkmn-spec',
			{
				requireOptions: true,
				multipleOptions: false,
				urlOnly: true
			}
		);
	}

	async run(msg, args) {
		if(args.item === `i'll`) {
			return sendError(msg, stripIndents`
				You're trying to add to the tag \`i'll\`. Please wrap your tag in quotations, like so:
				\`add-guess "i'll die" http://i.imgur.com/V8hvLx7.png\``
			);
		}

		if(args.item.substr(0, 4) === 'ill ') {
			args.item = `i'll ${args.item.substr(4)}`;
		}

		return super.run(msg, args);
	}
};
