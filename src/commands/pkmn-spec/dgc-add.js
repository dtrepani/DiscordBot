'use strict';

const ListAddCommand = require('../../bases/list/list-add');

module.exports = class DGCAddCommand extends ListAddCommand {
	constructor(client) {
		super(
			client,
			'dgc',
			'pkmn-spec',
			{
				requireOptions: true,
				multipleOptions: false,
				urlOnly: true
			},
			{
				examples: [
					'add-dgc echium `http://i.imgur.com/ZcmfAIp.png`',
					'add-dgc dgc `http://i.imgur.com/4jQkiR0.jpg`'
				]
			}
		);
	}

	/**
	 * @Override
	 */
	_getReply(args, list) {
		if(!list.hasOwnProperty(args.item.toLowerCase())) {
			throw new Error(`The only tags available are "echium" or "dgc".`);
		}

		return super._getReply(args, list);
	}
};
