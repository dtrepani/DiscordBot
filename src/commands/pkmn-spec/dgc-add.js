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
			}
		);
	}


	/**
	 * @Override
	 */
	getReply(args, list) {
		if(!list.hasOwnProperty(args.item.toLowerCase())) {
			throw new Error(`The only tags available are "echium" or "dgc".`);
		}

		return super.getReply(args, list);
	}
};
