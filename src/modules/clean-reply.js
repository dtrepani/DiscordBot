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
 * @param {?string} argsDisplay - Override the command args display. Useful if the sanitized content
 * 								 of the args is too verbose. Not relevant if the message is a DM.
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
		delMsg: true,
		argsDisplay: ''
	}, formatResInfo());

	if(resInfo.content === '' && embedIsEmpty() && !options.file) {
		winston.error(`ReplyToCmd: Embed, content, and file were empty for ${msg.cleanContent}`);
		throw new Error('Content or file may not be empty if there is no embed.');
	}

	let res = resInfo.content;
	if(!isDM()) {
		if(resInfo.argsDisplay !== '') res = constructResCustomDisplay();
		else res = `\`${msg.cleanContent}\`: ${res}`;
	}

	if(!isDM() && resInfo.delMsg) deleteMsg(msg, resInfo.delDelay);
	if(embedIsEmpty()) return msg.reply(res, options);
	return msg.replyEmbed(resInfo.embed, res, options);

	function embedIsEmpty() {
		return (resInfo.embed instanceof Object && Object.keys(resInfo.embed).length === 0);
	}

	function isDM() {
		return (msg.channel.type === 'dm' || msg.channel.type === 'group');
	}

	/**
	 * Quoting messages should be as accurate as possible. With custom args display, it's necessary to concat the
	 * command name onto the custom args. Using the default command name when the user did not use that specific name
	 * should be avoided to make the quote accurate. Parse the content to find the exact command used before
	 * joining with the custom args display.
	 * @returns {string}
	 */
	function constructResCustomDisplay() {
		const re = new RegExp(`^(.+)${msg.argString}`);
		const cmdUsed = msg.cleanContent.match(re)[1];
		return `\`${cmdUsed} ${resInfo.argsDisplay}\`: ${res}`;
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
