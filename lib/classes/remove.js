'use strict';

const Commando = require('discord.js-commando');
const winston = require('winston');
const commonTags = require('common-tags');
const fs = require('fs');
const sqlite = require('sqlite');
const alerts = require('../modules/alerts');

module.exports = class ListRemoveCommand extends Commando.Command {
	/**
	 * @typedef {Object} Reply
	 * @property {boolean} error - Whether or not an error occurred
	 * @property (string} msg - The message to reply with
	 */

	/**
	 * @typedef {Object} ListInfo
	 * @note multipleOptions from ListAddCommand will always be true.
	 * @property {boolean} requireOptions - Whether or not options are required
	 * @property {boolean} urlOnly - Whether or not args.item should only be URLs
	 */

	/**
	 *
	 * @param client
	 * @param {CommandClient} client
	 * @param {string} listName - Name of list
	 * @param {string} groupName - Name of group
	 * @param {ListInfo} listInfo - How the command handles the list
	 */
	constructor(client, listName, groupName, listInfo) {
		let info = {
			name: `${listName}-remove`,
			aliases: [ `remove-${listName}` ],
			group: groupName,
			memberName: `${listName}-remove`,
			examples: [],
			args: [
				{
					key: 'item',
					prompt: 'What would you like to remove?',
					type: 'string'
				},
				{
					key: 'options',
					prompt: 'From what tags?',
					type: 'string'
				}
			]
		};

		if(!listInfo.requireOptions) info.args[1].default = '';

		info = ListRemoveCommand.constructDescription(info, listName, listInfo);
		info = ListRemoveCommand.constructExamples(info, listName, listInfo);
		super(client, info);

		this.listName = listName;
		this.urlOnly = listInfo.urlOnly;
	}

	async run(msg, args) {
		let list = this.getList();
		let replyMsg = "";

		if(this.urlOnly && !this.isUrl(args.item)) {
			return alerts.sendError(msg, `Item must be a valid URL beginning with "http".`);
		}

		if(args.options) {
			let res = this.removeFromGivenTags(msg, args, list);

			if(res.error) {
				return alerts.sendError(msg, res.msg);
			}

			replyMsg = res.msg;
		} else {
			let res = this.removeItemFromAll(msg, args, list);

			if(res.error) {
				return alerts.sendError(msg, res.msg);
			}

			replyMsg = res.msg;
		}

		this.client.provider.set('global', this.listName, list)
			.catch(winston.error);

		msg.delete(2000);
		return msg.reply(replyMsg);
	}

	static constructDescription(info, listName, listInfo) {
		info.description = `Remove ` + ((listInfo.urlOnly) ? `a URL ` : `an item `);

		if(listInfo.requireOptions) {
			info.description += `from its corresponding tags `;
		}

		info.description += `from the ${listName} list.`;

		return info;
	}

	static constructExamples(info, listName, listInfo) {
		const command = `remove-${listName}`;
		const exampleUrl = `\`http://i.imgur.com/f75Pzvn.jpg\``;
		let examples = info.examples;

		if(!listInfo.requireOptions) {
			/* Always push URL example so user knows they can use URLs. */
			if(!listInfo.urlOnly) {
				examples.push(`${command} lenny`);
			}
			examples.push(`${command} ${exampleUrl}`);
		} else {
			examples.push(`${command} ${exampleUrl} kyuu lhu email`);
			examples.push(`${command} ${exampleUrl} kyuu`);
		}

		return info;
	}

	isUrl(item) {
		return (item.search(/https?:\/\/[^ \/\.]+\.[^ \/\.]+/) !== -1);
	}

	getList() {
		const path = `lib/assets/${this.listName}.json`;
		return this.client.provider.get(
			'global',
			this.listName,
			(fs.stat(path, (err, stats) => {
				if (err) return [];
				return fs.readFileSync(path);
			}))
		);
	}

	/**
	 * @returns {Reply}
	 */
	removeFromGivenTags(msg, args, list) {
		args.options = args.options.split(" ");

		if(list instanceof Array) {
			return {
				error: true,
				msg: commonTags.oneLine`\`${this.listName}\` does not support tags. 
					If the item you wish to remove has multiple words, please wrap them in quotation marks.`
			};
		}

		let errorTags = [];
		let successfulTags = [];

		args.options.forEach(tag => {
			if (list.hasOwnProperty(tag)) {
				if (this.removeItemFromTag(list, args, tag)) successfulTags.push(tag);
				else errorTags.push(tag);
			} else {
				errorTags.push(tag);
			}
		});

		if(successfulTags.length === 0) {
			return {
				error: true,
				msg: `All the tags given were either non-existent or already did not contain \`${args.item}\``
			}
		} else {
			return {
				error: false,
				msg: commonTags.oneLineCommaLists`\`${args.item}\` was removed from 
					\`${successfulTags}\`` +
					((errorTags.length !== 0)
						? `\n\n` + commonTags.oneLineCommaLists`:no_entry_sign: But the tag(s) \`${errorTags}\` were 
							either non-existent or already did not have the item.`
						: ``)
			}
		}
	}

	/**
	 * @returns {Reply}
	 */
	removeItemFromAll(msg, args, list) {
		if(list instanceof Array) {
			let itemIndex = list.indexOf(args.item);

			if(itemIndex === -1) {
				return {
					error: true,
					msg: `\`${args.item}\` is not in \`${this.listName}\``
				};
			}

			list.splice(itemIndex, 1);
		} else {
			for(let tag in list) {
				this.removeItemFromTag(list, args, tag);
			}
		}

		return {
			error: false,
			msg: `\`${args.item}\` was removed.`
		};
	}

	removeItemFromTag(list, args, tag) {
		let itemIndex = list[tag].indexOf(args.item);

		if(itemIndex === -1) {
			return false;
		}

		list[tag].splice(itemIndex, 1);

		if (list[tag].length === 0) {
			delete list[tag];
		}

		return true;
	}
}