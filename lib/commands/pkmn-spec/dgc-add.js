'use strict';

const alerts = require('../../modules/alerts');
const stripIndents = require('common-tags').stripIndents;
const fs = require('fs');
const sqlite = require('sqlite');
const ListAddCommand = require('../../classes/list-add.js');

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

	getReply(args, list) {
		if(!list.hasOwnProperty(args.item.toLowerCase())) {
			return {
				error: true,
				msg: `The only tags available are "echium" or "dgc".`
			}
		}

		return super.getReply(args, list);
	}
};