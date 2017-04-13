'use strict';

const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const chrono = require('chrono-node');
const moment = require('moment');
const { capitalizeFirstLetter } = require('../modules/string-format');
const cleanReply = require('../modules/clean-reply');
const sendError = require('../modules/send-error');

module.exports = class RemindTemplateCommand extends Command {
	constructor(client, commandInfo) {
		let commandArgs = [
			{
				key: 'reminder',
				prompt: 'What should I set a reminder about (and when)?',
				type: 'string',
				validate: reminder => chrono.parse(reminder).length > 0
			}
		];

		if(commandInfo.hasOwnProperty('args')) {
			commandArgs = commandInfo.args.concat(commandArgs);
		}

		commandInfo = Object.assign(
			commandInfo,
			{
				group: 'util',
				details: oneLine`Reminder times can be anything, absolute (3/12/17) or relative (tomorrow).
					If you're having trouble setting a reminder, type it as if you were speaking to a person.
					"Remind me in 10 minutes to check that," vs "Remind me 10 minutes check that"`,
				args: commandArgs
			}
		);

		super(client, commandInfo);
	}

	async run(msg, args) {
		const now = moment();
		const timeInfo = chrono.parse(args.reminder);
		const reminder = {
			time: moment(timeInfo[0].start.date()),
			title: this.getReminderTitle(args.reminder, timeInfo),
			remindee: this.getRemindee(msg, args)
		};
		
		if(reminder.time.isBefore(now)) {
			return await sendError(msg, `I can't set a reminder that's in the past.`);
		}

		return await this.sendMessages(msg, reminder);
	}

	/**
	 * @abstract
	 * @param {CommandMessage} msg
	 * @param {*} args
	 * @returns {string}
	 */
	getRemindee(msg, args) {} // eslint-disable-line no-unused-vars, no-empty-function

	/**
	 * To get the reminder title (the actual reminder text), we need to remove text that relates to the time
	 * and remove the "me  to" (two spaces from using ~remind me instead of ~remindme) or "to " in front of
	 * the reminder title, if there is one.
	 *
	 * @param {string} reminder - Full reminder text given by user
	 * @param {string[]} timeInfo - Parsed array containing time information
	 * @returns {string}
	 */
	getReminderTitle(reminder, timeInfo) {
		const reTime = new RegExp(timeInfo[0].text);
		
		let reminderTitle = reminder
							.replace(reTime, '')
							.trim()
							.replace(/^(me\s+)?to /i, '');

		reminderTitle = capitalizeFirstLetter(reminderTitle);

		return reminderTitle;
	}

	async sendMessages(msg, reminder) {
		const confirmation = await cleanReply(
			msg,
			`I've set a reminder to \`${reminder.title}\` ${reminder.time.fromNow()}.`
		);
		const reminderMsg = await this.sendReminder(msg, reminder);

		return [confirmation, reminderMsg];
	}

	async sendReminder(msg, reminder) {
		const now = moment();

		return await new Promise(resolve => {
			return setTimeout(() => {
				return resolve(msg.say(`${reminder.remindee}, here's your reminder: \`${reminder.title}\``));
			}, reminder.time.diff(now));
		});
	}
};
