'use strict';

const RemindTemplateCommand = require('../../bases/remind-template');

module.exports = class RemindMeCommand extends RemindTemplateCommand {
	constructor(client) {
		super(client, {
			name: 'remind-me',
			aliases: ['remind', 'reminder'],
			group: 'util',
			memberName: 'remind-me',
			description: `Create a reminder to do something at some time.`,
			examples: [
				'remind-me friday movie night!',
				`remind-me 4/13/2017 2:23pm Lhu's birthday!`,
				'remind-me to party hard at 12:03am tomorrow night'
			]
		});
	}

	/** @override */
	getRemindee(msg) {
		return msg.author;
	}
};
