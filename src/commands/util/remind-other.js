'use strict';

const RemindTemplateCommand = require('../../bases/remind-template');

module.exports = class RemindOtherCommand extends RemindTemplateCommand {
	constructor(client) {
		super(client, {
			name: 'remind-other',
			aliases: ['reminder-other'],
			memberName: 'remind-other',
			description: `Create a reminder to remind someone else at some time.`,
			examples: [
				'remind-other @everyone friday movie night!',
				`remind-other @Fizz#1234 4/13/2017 2:23pm Lhu's birthday!`,
				'remind-other @moderators to party hard at 12:03am tomorrow night'
			],
			args: [
				{
					key: 'remindee',
					prompt: 'Who do you want to remind?',
					type: 'member'
				}
			]
		});
	}

	/** @override */
	getRemindee(msg, args) {
		return args.remindee;
	}
};
