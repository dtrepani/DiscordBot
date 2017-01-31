'use strict';

const winston = require('winston');
const deleteMsg = require('./delete-msg');

/**
 * Clean replies remove the original message to "clean" the chat of commands.
 * The reply includes the cleaned content (AKA no mentions) of the original command along with any normal response
 * the command produces.
 * Generally only used on non-conversational commands.
 */

/**
 * @typedef {Object} MessageOptions
 * @see {@link https://discord.js.org/#/docs/main/master/typedef/MessageOptions}
 */

/**
 * @typedef {Object} ResponseInfo
 * @param {?String} content - Message to respond with
 * @param {?RichEmbed} embed - Embed to attach to message
 * @param {?boolean} [delMsg = true] - Whether to delete the message
 * @param {?integer} [delDelay = 2000] - Delay (in ms) before deleting message
 */

/**
 * @param {CommandMessage} msg
 * @param {ResponseInfo|string} resInfo - Information to use in constructing response. String is content only.
 * @param {MessageOptions} options
 * @returns {Promise}
 */
module.exports = (msg, resInfo = {}, options = {}) => {
	resInfo = Object.assign({
		content: '',
		embed: {},
		delMsg: true
	}, formatResInfo());

	if(resInfo.content === '' && embedIsEmpty()) {
		winston.error(`ReplyToCmd: Embed and content were empty for ${msg.cleanContent}`);
		throw new Error('Content may not be empty if there is no embed.');
	}

	const res = (msg.channel.type !== 'dm')
		? `\`${msg.cleanContent}\`: ${resInfo.content}`
		: resInfo.content;

	if(resInfo.delMsg) deleteMsg(msg, resInfo.delDelay);
	if(embedIsEmpty()) return msg.reply(res, options);
	return msg.replyEmbed(resInfo.embed, res, options);

	function embedIsEmpty() {
		return (resInfo.embed instanceof Object && Object.keys(resInfo.embed).length === 0);
	}

	/**
	 * resInfo can either be a string or an object. In the event it's a string, then only the content of the
	 * response was provided and resInfo must be reformatted to the ResponseInfo object.
	 * @returns {ResponseInfo}
	 */
	function formatResInfo() {
		if(resInfo instanceof Object) return resInfo;
		return { content: resInfo };
	}
};
