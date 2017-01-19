'use strict';

const Commando = require('discord.js-commando');
const winston = require('winston');
const commonTags = require('common-tags');
const fs = require('fs');
const sqlite = require('sqlite');
const alerts = require('../modules/alerts');

module.exports = class ListAddCommand extends Commando.Command {
	/**
	 * @typedef {Object} Reply
	 * @property {boolean} error - Whether or not an error occurred
	 * @property (string} msg - The message to reply with
	 */

	/**
	 * @typedef {Object} ListInfo
	 * @property {boolean} requireOptions - Whether or not options are required
	 * @property {boolean} multipleOptions - Whether or not to treat args.options as an array
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
		super(client, info);

		this.listName = listName;
		this.multipleOptions = listInfo.multipleOptions;
		this.urlOnly = listInfo.urlOnly;
	}

	async run(msg, args) {
        let list = this.getList();
        let res = this.getReply(args, list);

        if(res.error) {
            return alerts.sendError(msg, res.msg);
        }

        this.client.provider.set('global', this.listName, list)
            .catch(winston.error);

        msg.delete(2000);
        return msg.reply(res.msg);
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
                return this.pushToTags(msg, args, list);
            } else {
                if (list.hasOwnProperty(args.item)) {
                    return {
                        error: true,
                        msg: `\`${args.item}\` already exists. Please use another value.`
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
	pushToTags(msg, args, list) {
		const item = args.item;
		let tags = args.options;
		let errorKeys = [];

		tags.forEach(tag => {
			if (list.hasOwnProperty(tag)) {
				if (list[tag].indexOf(item) === -1) list[tag].push(item);
				else {
					errorKeys.push(tag);
				}
			} else list[tag] = [item];
		});

		if (errorKeys.length === 0) {
			return {
				error: true,
				msg: `\`${item}\` was added with tags: \`${tags.slice(0).join(", ")}\``
			};
		}

		return {
				error: false,
				msg: commonTags.oneLine`
						\`${tags[0]}\` is already in \`${errorKeys.join(", ")}\` 
						but any tags not listed were added successfully.`
			};
	}
}