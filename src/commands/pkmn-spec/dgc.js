'use strict';

const ListCommand = require('../../modules/list/list.js');

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
		const subList = (rand <= chanceForEchium) ? "echium" : "dgc";

		let res = super.getReply(args, list[subList]);
		if(!res.error) {
			res.msg = `\`${chanceForEchium}%\` chance for Echium: ` + res.msg
		}

		return res;
	}

	isNumber(number) {
		return (!isNaN(number) && isFinite(number));
	}
};