'use strict';

const config = require('../../assets/config.json');
const EventEmbed = require('../event-embed');
const EventLog = require('../base');

module.exports = class MessageDeleteEvent extends EventLog {
	constructor(client) {
		super(client, { name: 'messageDelete' });
	}

	/**
	 * @param {GuildMessage} msg - Message that was deleted
	 */
	_run(msg) {
		if(this._isCommand(msg) || this._isLogChannel(msg)) return;

		const member = msg.member;
		const embed = {
			author: {
				name: `${member.user.username}#${member.user.discriminator}`,
				icon_url: member.user.avatarURL // eslint-disable-line camelcase
			},
			description: `Message by ${member} deleted in ${msg.channel} 🗑️`,
			fields: [
				{
					name: `${config.embed_prefix} Message Content`,
					value: msg.content || 'None'
				}
			]
		};

		if(msg.attachments.size > 0) {
			embed.fields.push({
				name: `${config.embed_prefix} Attachments`,
				value: this._getAttachments(msg.attachments)
			});
		}

		EventEmbed.sendMessageEmbed(this._getLogChannel(msg.guild), member.user.id, embed);
	}

	_getAttachments(attachments) {
		return attachments.reduce((prevAttachments, attachment) => {
			const attachmentInfo = `${config.embed_bullet} ${attachment.filename} ${attachment.filesize}B`;

			// Don't start with a newline
			if(prevAttachments === '') return attachmentInfo;
			return `${prevAttachments}\n${attachmentInfo}`;
		}, '');
	}

	/**
	 * Check if the message is a command. Does not include the "say" command. This is so that guilds with the mod log
	 * setup will be able to see who is making the bot say what.
	 * @param {CommandMessage} msg
	 * @returns {boolean} Whether the message is a command
	 */
	_isCommand(msg) {
		msg = msg.content;
		if(!msg) return false;

		const botMention = `<@${this.client.user.id}> `;
		const prefix = `${this.client.commandPrefix}`;
		const cmd = `(\\S+)`;
		const re = new RegExp(`^(${botMention}|${prefix})${cmd}`, 'i');
		const matches = msg.match(re);

		if(matches !== null && matches[2] === 'say') return false;
		return (matches !== null);
	}
};
