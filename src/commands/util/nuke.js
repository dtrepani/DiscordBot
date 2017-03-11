'use strict';

const { isUrl } = require('../../modules/type-checks');
const { stripIndents } = require('common-tags');
const Commando = require('discord.js-commando');
const sendError = require('../../modules/send-error');

module.exports = class NukeCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'nuke',
			aliases: ['purge', 'prune', 'clean'],
			group: 'util',
			memberName: 'nuke',
			description: 'Delete messages. Filters available: user @User, me, bots, links, uploads',
			details: stripIndents`Delete messages. Filters available:
				**user @User:** Messages sent by @User
				**me:** Messages sent by you
				**bots:** Messages sent by bots
				**links:** Messages containing a link
				**uploads:** Messages containing an attachment`,
			examples: [
				'nuke 10',
				'nuke 2 user @Kyuu#9348',
				'nuke 5 links'
			],
			guildOnly: true,

			args: [
				{
					key: 'numToDelete',
					prompt: 'How many messages would you like to delete?',
					type: 'integer',
					max: 100
				},
				{
					key: 'filter',
					prompt: 'What filter would you like to apply?',
					type: 'string',
					default: ''
				},
				{
					key: 'member',
					prompt: 'Whose messages would you like to delete?',
					type: 'member',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		let messages;

		// Add 1 to the number to delete to account for the nuke message itself when deleting without a filter,
		// deleting self, or deleting user that is self (for those who fail to use the correct filter).
		const addCommandMsg = (!args.filter || args.filter === 'me' || msg.member.id === args.member.id);
		if(addCommandMsg) args.numToDelete++;

		if(!args.filter) {
			messages = await msg.channel.fetchMessages({ limit: args.numToDelete });
			await msg.channel.bulkDelete(messages.array().reverse());
		} else {
			try {
				messages = await msg.channel.fetchMessages({ limit: 100 });
				let messagesToDelete = messages.filterArray(this._getMessageFilter(msg, args));
				if(messagesToDelete.length > args.numToDelete) {
					messagesToDelete = messagesToDelete.slice(0, args.numToDelete);
				}

				if(messagesToDelete.length === 1) await messagesToDelete[0].delete();
				else await msg.channel.bulkDelete(messagesToDelete.reverse());
			} catch(err) {
				return sendError(err);
			}
		}

		// Message was already deleted via mass delete, so don't try to delete it again.
		if(addCommandMsg) return; // eslint-disable-line consistent-return

		return msg.delete();
	}

	_getMessageFilter(msg, args) {
		const filter = args.filter.toLowerCase();

		switch(filter) {
		case 'user':
			if(!args.member) {
				throw new Error(`Please provide a user (@User) to filter.`);
			}

			return message => message.author.id === args.member.id;
		case 'me':
			return message => message.author.id === msg.member.id;
		case 'bot':
		case 'bots':
			return message => message.author.bot;
		case 'link':
		case 'links':
			return message => isUrl(message.content);
		case 'upload':
		case 'uploads':
			return message => message.attachments.size !== 0;
		default:
			return null;
		}
	}
};
