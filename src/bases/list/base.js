'use strict';

const Commando = require('discord.js-commando');
const winston = require('winston');
const oneLine = require('common-tags').oneLine;
const fs = require('fs');
const deleteMsg = require('../../modules/delete-msg');
const alerts = require('../../modules/alerts');

module.exports = class ListBaseCommand extends Commando.Command {
	/**
	 * @typedef {Object} Reply
	 * @property {boolean} error - Whether or not an error occurred
	 * @property (string} msg - The message to reply with
	 */

	/**
	 * @typedef {Object} ListInfo
	 * @property {boolean} [readOnly = false] - Whether to set the list, which is not needed for read-only commands
	 * @property {boolean} [isArrList = false] - Whether the list is an object or an array; used when providing a
	 * 						default list to ListBaseCommand:getList()
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
		this.isArrList = listInfo.isArrList || false;
		this.readOnly = listInfo.readOnly || false;
		this.deleteMsgFlag = listInfo.deleteMsg || true;
	}

	async run(msg, args) {
		try {
			const list = this.getList();
			const reply = this.getReply(args, list);

			if(!this.readOnly) {
				this.setList(list);
			}

			deleteMsg(msg, this.deleteMsgFlag);
			return msg.reply(reply);
		} catch(err) {
			return alerts.sendError(msg, err);
		}
	}

	getList() {
		const path = 'src/assets/${this.listName}.json';
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
		return (item.search(/https?:\/\/[^ \/\.]+\.[^ \/\.]+/) !== -1); // eslint-disable-line no-useless-escape
	}

	/**
	 * The reply will change based on whatever the command does and thus must be overridden.
	 * @abstract
	 * @param {Array} args
	 * @param {Object|Array} list
	 * @returns {Reply}
	 */
	getReply(args, list) { // eslint-disable-line no-unused-vars
		throw new Error(oneLine`ListBase:getReply() was not overridden.
                This error should never happen. Please contact <@${this.client.options.owner}>`);
	}
};
