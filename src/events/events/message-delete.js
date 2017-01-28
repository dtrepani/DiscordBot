'use strict';

const EventLog = require('../base');
const EventEmbed = require('../event-embed');
const config = require('../../assets/config.json');

module.exports = class MessageDeleteEvent extends EventLog {
	constructor(client) {
		super(client, { name: 'messageDelete' });
	}

	/**
	 * @param {GuildMessage} msg - Message that was deleted
	 */
	run(msg) {
		if(this.isCommand(msg) || this.isLogChannel(msg)) return;

		const member = msg.member;
		const embed = {
			author: {
				name: `${member.user.username}#${member.user.discriminator}`,
				icon_url: member.user.avatarURL // eslint-disable-line camelcase
			},
			description: `Message by ${member} deleted in ${msg.channel}`,
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
				value: this.getAttachments(msg.attachments)
			});
		}

		EventEmbed.sendMessageEmbed(this.getLogChannel(msg.guild), member.user.id, embed);
	}

	getAttachments(attachments) {
		return attachments.reduce((attachmentsStr, attachment) => {
			const attachmentInfo = `${config.embed_bullet} ${attachment.filename} ${attachment.filesize}B`;

			// Don't start with a newline
			if(attachmentsStr === '') return attachmentInfo;
			return `${attachmentsStr}\n${attachmentInfo}`;
		}, '');
	}

	isCommand(msg) {
		if(!msg.content) return false;
		const firstChar = msg.content[0];
		return (firstChar === (this.client.commandPrefix || config.prefix));
	}

	isLogChannel(msg) {
		return (this.getLogChannel(msg.guild) === msg.channel);
	}
};
