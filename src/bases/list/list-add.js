'use strict';

const { oneLine, commaLists } = require('common-tags');
const ListBaseCommand = require('./base');

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
	 * @property {boolean} [readOnly = false] - Whether to set the list, which is not needed for read-only commands
	 * @property {boolean} [isArrList = false] - Whether the list is an object or an array; used when providing a
	 * 						default list to ListBaseCommand:getList()
	 * @property {boolean} requireOptions - Whether or not options are required
	 * @property {boolean} multipleOptions - Whether or not to treat args.options as an array
	 * @property {boolean} urlOnly - Whether or not args.item should only be URLs
	 * @property {boolean} [deleteMsg = true] - Whether to delete the message when done
	 */

	/**
	 * @param {CommandClient} client
	 * @param {string} listName - Name of list
	 * @param {string} groupName - Name of group
	 * @param {ListInfo} listInfo - How the command handles the list
	 * @param {CommandInfo} [commandInfo = {}] - Override the default command info constructed
	 */
	constructor(client, listName, groupName, listInfo, commandInfo = {}) {
		let info = {
			name: `${listName}-add`,
			aliases: [`add-${listName}`],
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

		Object.assign(info, commandInfo);
		super(client, listName, info, listInfo);

		this.multipleOptions = listInfo.multipleOptions;
	}

	static constructDescription(info, listName, listInfo) {
		info.description = `Add ${(listInfo.urlOnly) ? `a URL ` : `an item `}`;

		if(listInfo.requireOptions) {
			info.description += (listInfo.multipleOptions)
				? 'with its corresponding tags '
				: 'with a corresponding value ';
		}

		info.description += `to the ${listName} list.`;

		return info;
	}

	static constructExamples(info, listName, listInfo) {
		const command = `add-${listName}`;
		const exampleUrl = `\`http://i.imgur.com/f75Pzvn.jpg\``;
		const examples = info.examples;

		if(!listInfo.requireOptions) {
			/* Always push URL example so user knows they can use URLs. */
			if(!listInfo.urlOnly) {
				examples.push(`${command} "snippet of text"`);
			}
			examples.push(`${command} ${exampleUrl}`);
		} else if(listInfo.multipleOptions) {
			examples.push(`${command} ${exampleUrl} kyuu lhu email`);
			examples.push(`${command} ${exampleUrl} kyuu`);
		} else {
			examples.push(`${command} lenny "( ͡° ͜ʖ ͡°)"`);
			examples.push(`${command} omw "On my way!"`);
			examples.push(`${command} u you`);
		}

		return info;
	}

	checkIfURLRequiredAndItemIsURL(item) {
		if(this.urlOnly && !this.isUrl(item)) throw new Error(`Item must be a valid URL beginning with "http".`);
	}

	/**
	 * @Override
	 */
	getReply(args, list) {
		if(args.options) {
			if(this.multipleOptions) {
				return this.getReplyForMultipleOptions(args, list);
			}
			return this.getReplyForSingleOption(args, list);
		}
		return this.getReplyForNoOptions(args, list);
	}

	getReplyForMultipleOptions(args, list) {
		this.checkIfURLRequiredAndItemIsURL(args.item);

		args.options = args.options.split(' ');
		return this.pushToTags(args, list);
	}

	getReplyForNoOptions(args, list) {
		this.checkIfURLRequiredAndItemIsURL(args.item);

		if(list.includes(args.item)) throw new Error(`\`${args.item}\` is already in \`${this.listName}\``);

		list.push(args.item);
		return commaLists`\`${args.item}\` was added.`;
	}

	getReplyForSingleOption(args, list) {
		if(!this.urlOnly && this.isUrl(args.item)) {
			throw new Error(oneLine`Item must not be a URL. Did you perhaps mix up your arguments?
				See examples in \`help ${this.listName}\``);
		}

		if(!this.urlOnly) args.item = args.item.toLowerCase();

		if(list[args.item] instanceof Array) {
			if(list[args.item].includes(args.options)) {
				throw new Error(`\`${args.options}\` is already in \`${args.item}\``);
			}

			list[args.item].push(args.options);
		} else {
			if(list.hasOwnProperty(args.item)) {
				throw new Error(`\`${args.item}\` already exists. Please use another value.`);
			}

			list[args.item] = args.options;
		}

		return commaLists`\`${args.options}\` was added to \`${args.item}\``;
	}

	pushToTags(args, list) {
		const item = args.item;
		const tags = args.options;
		const errorKeys = [];

		tags.forEach(tag => {
			tag = tag.toLowerCase();

			if(list.hasOwnProperty(tag)) {
				if(list[tag].indexOf(item) === -1) list[tag].push(item);
				else errorKeys.push(tag);
			} else { list[tag] = [item]; }
		});

		if(errorKeys.length === tags.length) {
			throw new Error(`\`${args.item}\` is already in \`${errorKeys.join(', ')}\``);
		}

		if(errorKeys.length !== 0) {
			return oneLine`\`${args.item}\` is already in \`${errorKeys.join(', ')}\`
						but any tags not listed were added successfully.`;
		}

		return `\`${item}\` was added with tags \`${tags.slice(0).join(', ')}\``;
	}
};
