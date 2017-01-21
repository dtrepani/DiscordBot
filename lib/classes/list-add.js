'use strict';

const commonTags = require('common-tags');
const ListBaseCommand = require('./list-base');

module.exports = class ListAddCommand extends ListBaseCommand {
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
	 * @property {boolean} [isArrList = false] - Whether the list is an object or an array
	 * @property {boolean} requireOptions - Whether or not options are required
	 * @property {boolean} multipleOptions - Whether or not to treat args.options as an array
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
			name: `${listName}-add`,
			aliases: [ `add-${listName}` ],
			group: groupName,
			memberName: `${listName}-add`,
			examples: [],
			args: [
				{
					key: 'item',
					prompt: 'What would you like to add?',
					type: 'string'
				},
				{
					key: 'options',
					type: 'string'
				}
			]
		};

		if(!listInfo.requireOptions) info.args[1].default = '';

		info.args[1].prompt = (listInfo.multipleOptions)
			? 'What tags would you like?'
			: 'With what value?';

		info = ListAddCommand.constructDescription(info, listName, listInfo);
		info = ListAddCommand.constructExamples(info, listName, listInfo);
		super(client, listName, info, listInfo.isArrList);

		this.multipleOptions = listInfo.multipleOptions;
		this.urlOnly = listInfo.urlOnly;
	}

	static constructDescription(info, listName, listInfo) {
		info.description = `Add ` + ((listInfo.urlOnly) ? `a URL ` : `an item `);

		if(listInfo.requireOptions) {
			info.description += (listInfo.multipleOptions)
				? `with its corresponding tags `
				: `with a corresponding value `;
		}

		info.description += `to the ${listName} list.`;

		return info;
	}

	static constructExamples(info, listName, listInfo) {
		const command = `add-${listName}`;
		const exampleUrl = `\`http://i.imgur.com/f75Pzvn.jpg\``;
		let examples = info.examples;

		if(!listInfo.requireOptions) {
			/* Always push URL example so user knows they can use URLs. */
			if(!listInfo.urlOnly) {
				examples.push(`${command} "snippet of text"`);
			}
			examples.push(`${command} ${exampleUrl}`);
		} else {
			if(listInfo.multipleOptions) {
				examples.push(`${command} ${exampleUrl} kyuu lhu email`);
				examples.push(`${command} ${exampleUrl} kyuu`);
			} else {
				examples.push(`${command} lenny "( ͡° ͜ʖ ͡°)"`);
				examples.push(`${command} omw "On my way!"`);
				examples.push(`${command} u you`);
			}
		}

		return info;
	}

    /**
     * @return {Reply}
     */
	getReply(args, list) {
        if(this.urlOnly && !this.isUrl(args.item)) {
            return {
                error: true,
                msg: `Item must be a valid URL beginning with "http".`
            };
        }

        if(args.options) {
            if(this.multipleOptions) {
                args.options = args.options.split(" ");
                return this.pushToTags(args, list);
            } else {
                if (list.hasOwnProperty(args.item)) {
                    return {
                        error: true,
                        msg: `\`${args.item}\` already exists. Please use another value.`
                    };
                }

	            if(!this.urlOnly && this.isUrl(args.item)) {
					return {
						error: true,
						msg: commonTags.oneLine`Item must not be a URL. Did you perhaps mix up your arguments? 
							See examples in \`help ${this.listName}\``
					};
	            }

                list[args.item] = args.options;

                return {
                    error: false,
                    msg: commonTags.commaLists`\`${args.item}\` was added to \`${args.options}\``
                };
            }
        }

        list.push(args.item);

        return {
            error: false,
            msg: commonTags.commaLists`\`${args.item}\` was added.`
        };
    }

	/**
	 * @returns {Reply}
	 */
	pushToTags(args, list) {
		const item = args.item;
		let tags = args.options;
		let errorKeys = [];

		tags.forEach(tag => {
			tag = tag.toLowerCase();

			if (list.hasOwnProperty(tag)) {
				if (list[tag].indexOf(item) === -1) list[tag].push(item);
				else {
					errorKeys.push(tag);
				}
			} else list[tag] = [item];
		});

		if(errorKeys.length === tags.length) {
			return {
				error: true,
				msg: `\`${args.item}\` is already in \`${errorKeys.join(", ")}\``
			}
		}

		if(errorKeys.length !== 0) {
			return {
				error: false,
				msg: commonTags.oneLine`
						\`${args.item}\` is already in \`${errorKeys.join(", ")}\` 
						but any tags not listed were added successfully.`
			};
		}

		return {
			error: false,
			msg: `\`${item}\` was added with tags \`${tags.slice(0).join(", ")}\``
		};
	}
};