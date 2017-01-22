'use strict';

const commonTags = require('common-tags');
const ListBaseCommand = require('./list-base');

module.exports = class ListRemoveCommand extends ListBaseCommand {
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
	 * @property {boolean} requireOptions - Whether or not options are required
	 * @property {boolean} urlOnly - Whether or not args.item should only be URLs
	 */

	/**
	 * @param {CommandClient} client
	 * @param {string} listName - Name of list
	 * @param {string} groupName - Name of group
	 * @param {ListInfo} listInfo - How the command handles the list
	 */
	constructor(client, listName, groupName, listInfo) {
		let info = {
			name: `${listName}-remove`,
			aliases: [
				`remove-${listName}`,
				`rem-${listName}`,
				`${listName}-rem`,
				`del-${listName}`,
				`${listName}-del`
			],
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

		super(client, listName, info, listInfo);

		this.urlOnly = listInfo.urlOnly;
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

    /**
	 * @returns {Reply}
     */
    getReply(args, list) {
        if(this.urlOnly && !this.isUrl(args.item)) {
            return {
            	error: true,
				msg: `Item must be a valid URL beginning with "http".`
			};
        }

        if(args.options) {
            return this.removeFromGivenTags(args, list);
        }

		return this.removeItemFromAll(args, list);
	}

	/**
	 * @returns {Reply}
	 */
	removeFromGivenTags(args, list) {
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
			tag = tag.toLowerCase();

			console.log(tag + " and " + list.hasOwnProperty(tag));

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
				msg: `All the tags given (\`${args.options}\`) were either non-existent or already did not contain \`${args.item}\``
			};
		} else {
			return {
				error: false,
				msg: commonTags.oneLineCommaLists`\`${args.item}\` was removed from 
					\`${successfulTags}\`` +
					((errorTags.length !== 0)
						? `\n\n` + commonTags.oneLineCommaLists`:no_entry_sign: But the tag(s) \`${errorTags}\` were 
							either non-existent or already did not have the item.`
						: ``)
			};
		}
	}

	/**
	 * @returns {Reply}
	 */
	removeItemFromAll(args, list) {
		let tagsRemovedFrom = [];

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
				if(this.removeItemFromTag(list, args, tag)) {
					tagsRemovedFrom.push(tag);
				}
			}
		}

		return {
			error: false,
			msg: `\`${args.item}\` was removed` +
				((tagsRemovedFrom.length > 1)
					? ` from \`${tagsRemovedFrom.join(", ")}\``
					: `.`)
		};
	}

	removeItemFromTag(list, args, tag) {
		if(!this.isUrl(args.item)) {
			args.item = args.item.toLowerCase();
		}

		if(list[tag] && (typeof list[tag] === "string" || list[tag] instanceof String)) {
			if (tag !== args.item) {
				return false;
			}

			delete list[args.item];
		} else {
			const itemIndex = list[tag].indexOf(args.item);

			if (itemIndex === -1) {
				return false;
			}

			list[tag].splice(itemIndex, 1);

			if (list[tag].length === 0) {
				delete list[tag];
			}
		}

		return true;
	}
};