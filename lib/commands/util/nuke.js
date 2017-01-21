const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const alerts = require('../../modules/alerts');

module.exports = class NukeCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'nuke',
			aliases: ['purge', 'prune', 'clean'],
			group: 'util',
			memberName: 'nuke',
			description: 'Deletes messages.',
			details: `Deletes messages. Here is a list of filters:
				__invites:__ Messages containing an invite
				__user @user:__ Messages sent by @user
				__bots:__ Messages sent by bots
				__uploads:__ Messages containing an attachment
				__links:__ Messages containing a link`,
			guildOnly: true,

			args: [
				{
					key: 'limit',
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

	// TODO: fix filters lol
	async run(msg, args) {
		const limit = args.limit;
		const filter = args["filter"].toLowerCase();
		let messageFilter;

		switch(filter) {
			case 'bots':
				messageFilter = message => message.author.bot;
				break;
			case 'links':
				messageFilter = message => message.content.search(/https?:\/\/[^ \/\.]+\.[^ \/\.]+/) !== -1; // eslint-disable-line no-useless-escape
				break;
			case 'invite':
				messageFilter = (message =>
					message.content.search(/(discord\.gg\/.+|discordapp\.com\/invite\/.+)/i) !== -1
				);
				break;
			case 'upload':
				messageFilter = message => message.attachments.size !== 0;
				break;
			case 'user':
				if (!args.member) {
					return alerts.sendError(`Please provide a user (@User) to filter.`);
				}
				messageFilter = message => message.author.id === args.member.user.id;
				break;
			case 'you':
				messageFilter = message => message.author.id === message.client.user.id;
				break;
		}

		msg.delete();

		if (!filter) {
			const messagesToDelete = await msg.channel.fetchMessages({ limit: limit });

			msg.channel.bulkDelete(messagesToDelete.array().reverse());
		} else {
			const messages = await msg.channel.fetchMessages({ limit: limit });
			const messagesToDelete = messages.filter(messageFilter);

			msg.channel.bulkDelete(messagesToDelete.array().reverse());
		}
	}
};
