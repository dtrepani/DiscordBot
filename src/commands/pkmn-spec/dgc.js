'use strict';

const ListCommand = require('../../bases/list/list');

module.exports = class DGCCommand extends ListCommand {
	constructor(client) {
		super(
			client,
			'dgc',
			'pkmn-spec',
			{ requireItem: false }
		);
	}


	/**
	 * @Override
	 */
	getReply(args, list) {
		let chanceForEchium = 50;

		if(args.item) {
			const item = parseFloat(args.item);

			if(this.isNumber(item)) chanceForEchium = item;
			else throw new Error('Value entered must be a number.');
		}

		const rand = Math.floor(Math.random() * 100);
		const subList = (rand <= chanceForEchium) ? 'echium' : 'dgc';
		const res = super.getReply(args, list[subList]);
		
		return `\`${chanceForEchium}%\` chance for Echium: ${res}`;
	}

	isNumber(number) {
		return (!isNaN(number) && isFinite(number));
	}
};
