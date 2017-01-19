'use strict';

const Commando = require('discord.js-commando');
const winston = require('winston');
const commonTags = require('common-tags');
const fs = require('fs');
const sqlite = require('sqlite');
const alerts = require('../modules/alerts');

// TODO: Add option for global or local list
module.exports = class ListCommand extends Commando.Command {
    /**
     * @typedef {Object} Reply
     * @property {boolean} error - Whether or not an error occurred
     * @property (string} msg - The message to reply with
     */

    /**
     * @typedef {Object} ListInfo
     * @property {boolean} requireItem - Whether or not item is required
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
        super(client, info);

        this.listName = listName;
        this.requireItem = listInfo.requireItem;
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
        info.description = `Get an item `;

        if(listInfo.requireItem) {
            info.description = `Get an item `;
        }

        info.description += `to the ${listName} list.`;

        return info;
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
    getReply(args, list) {
        if(this.requireItem && list instanceof Array) {
            return this.handleItemOnArrList(args, list);
        } else if(list instanceof Array) {
            return {
                error: false,
                msg: this.getRandomItemFromArrList(list)
            };
        } else if(args.item) {
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
        }
    }

    getRandomItem(list) {
        var keys = Object.keys(list);
        var randKey = this.getRandomItemFromArrList(keys);

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
            msg: this.getRandomItemFromArrList(list[args.item])
        };
    }

    getRandomItemFromArrList(arrList) {
        return ((arrList && arrList.length > 0)
            ? arrList[Math.floor(Math.random() * arrList.length)]
            : "");
    }
}