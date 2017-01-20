'use strict';

const Commando = require('discord.js-commando');
const commonTags = require('common-tags');
const ListBaseCommand = require('./list-base');

module.exports = class ListTagsCommand extends ListBaseCommand {
	/**
	 * @typedef {Object} Reply
	 * @property {boolean} error - Whether or not an error occurred
	 * @property (string} msg - The message to reply with
	 */

	/**
	 * @typedef {Object} ListInfo
	 * @property {boolean} [isArrList = false] - Whether the list is an object or an array
	 */

	/**
	 * @param {CommandClient} client
	 * @param {string} listName - Name of list
	 * @param {string} groupName - Name of group
	 * @param {ListInfo} [listInfo = {}] - How the command handles the list
	 */
	constructor(client, listName, groupName, listInfo = {}) {
		let info = {
			name: `${listName}-tags`,
			aliases: [ `tags-${listName}` ],
			group: groupName,
			memberName: `${listName}-tags`,
			description: `List the tags currently added.`
		};
		super(client, listName, info, listInfo);
	}

	/**
	 * @returns {Reply}
	 */
	getReply(args, list) {
		if(list instanceof Array) {
			return {
				error: true,
				msg: `This list does not support tags. You should never see this message. Please contact @Kyuu#9284.`
			};
		}

		let tags = list ? Object.keys(list) : [];

		if(tags.length === 0) {
			return {
				error: false,
				msg: `There are no tags added currently.`
			};
		}

		return {
			error: false,
			msg: commonTags.stripIndents`\`${this.listName}\` tags:
				\`\`\`${tags.sort().join(", ")}\`\`\``
		};
	}
}