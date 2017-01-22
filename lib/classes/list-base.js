'use strict';

const Commando = require('discord.js-commando');
const winston = require('winston');
const oneLine = require('common-tags').oneLine;
const fs = require('fs');
const sqlite = require('sqlite');
const alerts = require('../modules/alerts');

module.exports = class ListBaseCommand extends Commando.Command {
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
	 * @param {CommandInfo} commandInfo
	 * @param {ListInfo} listInfo - How the command handles the list
	 */
	constructor(client, listName, commandInfo, listInfo) {
		super(client, commandInfo);
		this.listName = listName;
		this.isArrList = listInfo.isArrList ? listInfo.isArrList : false;
		this.readOnly = listInfo.readOnly ? listInfo.readOnly : false;
		this.deleteMsg = listInfo.deleteMsg ? listInfo.deleteMsg : true;
	}

	async run(msg, args) {
		let list = this.getList();
		let res = this.getReply(args, list);

		if(res.error) {
			return alerts.sendError(msg, res.msg);
		}

		if(!this.readOnly) {
			this.setList(list);
		}

		if(this.deleteMsg) msg.delete(2000);
		return msg.reply(res.msg);
	}

	getList() {
		const path = `lib/assets/${this.listName}.json`;
		let defaultList;

		try {
			fs.accessSync(path, fs.constants.F_OK);
			defaultList = JSON.parse(fs.readFileSync(path));
		} catch(err) {
			defaultList = (this.isArrList) ? {} : [];
		}

		return this.client.provider.get(
			'global',
			this.listName,
			defaultList
		);
	}

	setList(list) {
		this.client.provider.set('global', this.listName, list)
			.catch(winston.error);
	}

	isUrl(item) {
		return (item.search(/https?:\/\/[^ \/\.]+\.[^ \/\.]+/) !== -1);
	}

	/**
	 * The reply will change based on whatever the command does and thus must be overridden.
	 * @returns {Reply}
	 */
	getReply(args, list) {
		return {
			error: true,
			msg: oneLine`ListBase:getReply() was not overridden. 
                This error should never happen. Please contact @Kyuu#9384`
		};
	}
};