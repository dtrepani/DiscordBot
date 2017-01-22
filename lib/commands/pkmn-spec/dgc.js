'use strict';

const ListCommand = require('../../classes/list.js');

module.exports = class DGCCommand extends ListCommand {
	constructor(client) {
		super(
			client,
			'dgc',
			'pkmn-spec',
			{
				requireItem: false
			}
		);
	}

	getReply(args, list) {
		let chanceForEchium = 50;

		if(args.item) {
			const item = parseFloat(args.item);

			if (this.isNumber(item)) {
				chanceForEchium = item;
			} else {
				return {
					error: true,
					msg: `Value entered must be a number.`
				};
			}
		}

		const rand = Math.floor(Math.random() * 100);
		if(rand <= chanceForEchium) {
			return super.getReply(args, list["echium"]);
		}

		return super.getReply(args, list["dgc"]);
	}

	isNumber(number) {
		return (!isNaN(number) && isFinite(number));
	}
};