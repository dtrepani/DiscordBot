'use strict';

const { isNumber } = require('../../modules/type-checks');
const { oneLine } = require('common-tags');
const ListCommand = require('../../bases/list/list');

module.exports = class DGCCommand extends ListCommand {
	constructor(client) {
		super(
			client,
			'dgc',
			'pkmn-spec',
			{ requireItem: false },
			{
				description: oneLine`Take your chances with dark green cucumbers (dgc). 
					Will you get a dark green cucumber or an actual dark green cucumber?`,
				details: oneLine`Of course, you could always cheat and skew your chances. The higher the number, the
					higher the chance for Echium.`,
				examples: ['dgc', 'dgc 80']
			}
		);
	}

	/**
	 * @Override
	 */
	_getReply(args, list) {
		let chanceForEchium = 50;

		if(args.item) {
			const item = parseFloat(args.item);
			if(!isNumber(item)) throw new Error('Value entered must be a number.');
			chanceForEchium = item;
		}

		const rand = Math.floor(Math.random() * 100);
		const subList = (rand <= chanceForEchium) ? 'echium' : 'dgc';
		const res = super._getReply(args, list[subList]);
		
		return `${chanceForEchium}% chance for Echium: ${res}`;
	}
};
