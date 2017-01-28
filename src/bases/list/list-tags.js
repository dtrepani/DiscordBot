'use strict';

const { stripIndents, oneLine } = require('common-tags');
const ListBaseCommand = require('./base');

module.exports = class ListTagsCommand extends ListBaseCommand {
	/**
	 * @typedef {Object} Reply
	 * @property {boolean} error - Whether or not an error occurred
	 * @property (string} msg - The message to reply with
	 */

	/**
	 * @typedef {Object} CommandClient
	 * @see module:discord.js-commando
	 */

	/**
	 * @typedef {Object} ListInfo
	 * @property {boolean} [readOnly = false] - Whether to set the list, which is not needed for read-only commands
	 * @property {boolean} [isArrList = false] - Whether the list is an object or an array; used when providing a
	 *                     default list to ListBaseCommand:getList()
	 * @property {boolean} [deleteMsg = true] - Whether to delete the message when done
	 */

	/**
	 * @param {CommandClient} client
	 * @param {string} listName - Name of list
	 * @param {string} groupName - Name of group
	 * @param {ListInfo} [listInfo = {}] - How the command handles the list
	 * @param {CommandInfo} [commandInfo = {}] - Override the default command info constructed
	 */
	constructor(client, listName, groupName, listInfo = {}, commandInfo = {}) {
		const info = {
			name: `${listName}-tags`,
			aliases: [`tags-${listName}`],
			group: groupName,
			memberName: `${listName}-tags`,
			description: 'List the tags currently added.'
		};
		Object.assign(info, commandInfo);
		super(client, listName, info, listInfo);
	}

	/**
	 * @Override
	 */
	getReply(args, list) {
		if(list instanceof Array) {
			throw new Error(oneLine`This list does not support tags. 
				You should never see this message. Please contact <@${this.client.options.owner}>`);
		}

		const tags = list ? Object.keys(list) : [];

		if(tags.length === 0) return 'There are no tags added currently.';

		return stripIndents`\`${this.listName}\` tags:
				\`\`\`${tags.sort().join(', ')}\`\`\``;
	}
};
