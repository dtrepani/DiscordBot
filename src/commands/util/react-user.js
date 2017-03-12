'use strict';

const { oneLine, stripIndents } = require('common-tags');
const ReactTemplateCommand = require('../../bases/react/react-template');
const ForNumberPPBehavior = require('../../bases/react/for-number-pp-behavior');

module.exports = class ReactUserCommand extends ReactTemplateCommand {
	constructor(client) {
		super(
			client,
			{
				name: 'react-user',
				aliases: ['react-usr'],
				memberName: 'react-user',
				description: `Add reactions to a user's message.`,
				details: stripIndents`${oneLine`Add reactions to a user's message. Letters will automatically be
						converted to emojis.`}
					${oneLine`Optionally, specify how far back the message is you want to react to 
						(with 1 being the latest), relative to the user to whom you want
						to react. **See examples.**`}
					${oneLine`For a more precise reaction, you can specify the number of messages back`}`,
				examples: [
					`To react to User's latest message: \`react-user @User#0000 "i love u"\``,
					`To react to User's fifth latest message: \`react-user @User#0000 5 "i love u :heart:"\``
				],
				args: [
					{
						key: 'member',
						prompt: 'Which user are you reacting to?',
						type: 'member'
					},
					{
						key: 'reactionInfo',
						prompt: 'Which message are you reacting to (1 is the latest)? How would you like to react?',
						type: 'string'
					}
				]
			},
			new ForNumberPPBehavior()
		);
	}

	/** @override */
	async _getMessageToReactTo(msg, args) {
		const messages = (await this._getMessages(msg)).filter(message => message.author.id === args.member.id);
		return this._getMessageFromMessages(msg, args.msgInd, messages);
	}
};
