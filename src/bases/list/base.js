'use strict';

const { oneLine } = require('common-tags');
const cleanReply = require('../../modules/clean-reply');
const Commando = require('discord.js-commando');
const fs = require('fs');
const sendError = require('../../modules/send-error');
const winston = require('winston');

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

		listInfo = Object.assign({
			readOnly: false,
			deleteMsg: true,
			isArrList: false
		}, listInfo);

		this._listName = listName;
		this._isArrList = listInfo.isArrList;
		this._readOnly = listInfo.readOnly;
		this._deleteMsg = listInfo.deleteMsg;
	}

	async run(msg, args) {
		try {
			const list = this._getList();
			const reply = this._getReply(args, list);

			if(!this._readOnly) {
				this._setList(list);
			}

			return cleanReply(msg, reply);
		} catch(err) {
			return sendError(msg, err);
		}
	}

	_getList() {
		const path = `src/assets/${this._listName}.json`;
		let defaultList;

		try {
			fs.accessSync(path, fs.constants.F_OK);
			defaultList = JSON.parse(fs.readFileSync(path));
		} catch(err) {
			defaultList = (this._isArrList) ? [] : {};
		}

		return this.client.provider.get(
			'global',
			this._listName,
			defaultList
		);
	}

	_setList(list) {
		this.client.provider.set('global', this._listName, list)
			.catch(winston.error);
	}

	/**
	 * The reply will change based on whatever the command does and thus must be overridden.
	 * @abstract
	 * @param {Array} args
	 * @param {Object|Array} list
	 * @returns {String}
	 */
	_getReply(args, list) { // eslint-disable-line no-unused-vars
		throw new Error(oneLine`ListBase:getReply() was not overridden.
			This error should never happen. Please contact <@${this.client.options.owner}>`);
	}
};
