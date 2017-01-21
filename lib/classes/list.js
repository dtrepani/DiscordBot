'use strict';

const winston = require('winston');
const commonTags = require('common-tags');
const alerts = require('../modules/alerts');
const ListBaseCommand = require('./list-base');

// TODO: Add option for global or local list
module.exports = class ListCommand extends ListBaseCommand {
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
     * @property {boolean} requireItem - Whether or not item is required
     */

    /**
     * @param {CommandClient} client
     * @param {string} listName - Name of list
     * @param {string} groupName - Name of group
     * @param {ListInfo} listInfo - How the command handles the list
     */
    constructor(client, listName, groupName, listInfo) {
        let info = {
            name: `${listName}`,
            aliases: [ `${listName}` ],
            group: groupName,
            memberName: `${listName}`,
            examples: [],
            args: [
                {
                    key: 'item',
                    prompt: 'What item?',
                    type: 'string'
                }
            ]
        };

        if(!listInfo.requireItem) info.args[0].default = '';

        info = ListCommand.constructDescription(info, listName, listInfo);
        super(client, listName, info, listInfo.isArrList);

        this.requireItem = listInfo.requireItem;
    }

    static constructDescription(info, listName, listInfo) {
        info.description = `Get an item `;

        if(listInfo.requireItem) {
            info.description = `Get an item `;
        }

        info.description += `from the ${listName} list.`;

        return info;
    }

    /**
     * @returns {Reply}
     */
    getReply(args, list) {
    	if(list instanceof Array) {
    		if(this.requireItem) {
			    return this.handleItemOnArrList(args, list);
		    }

		    return {
			    error: false,
			    msg: this.getRandomItemFromArrList(list)
		    };
	    } else if(args.item) {
	        args.item = args.item.toLowerCase();
            return this.getRandomItemFromTag(args, list);
        }

        return this.getRandomItem(list);
    }

    /**
     * Array lists that require an item will handle it on a per-list basis and thus must override this method.
     * @returns {Reply}
     */
    handleItemOnArrList(args, list) {
        return {
            error: true,
            msg: commonTags.oneLine`ListCommand:handleItemOnArrList() was not overridden. 
                This error should never happen. Please contact @Kyuu#9384`
        };
    }

    getRandomItem(list) {
        let keys = Object.keys(list);
        let randKey = this.getRandomItemFromArrList(keys);

        return {
            error: false,
            msg: this.getRandomItemFromArrList(list[randKey])
        };
    }

    getRandomItemFromTag(args, list) {
        if (!list.hasOwnProperty(args.item)) {
            return {
                error: true,
                msg: `\`${args.item}\` is not a valid tag.`
            };
        }

        return {
            error: false,
            msg: `\`${this.listName} ${args.item}\`: ${this.getRandomItemFromArrList(list[args.item])}`
        };
    }

    getRandomItemFromArrList(arrList) {
    	if(typeof arrList === "string" || arrList instanceof String) {
    		return arrList;
	    }

        return ((arrList && arrList.length > 0)
            ? arrList[Math.floor(Math.random() * arrList.length)]
            : ""
        );
    }
};