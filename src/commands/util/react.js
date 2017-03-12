'use strict';

const { oneLine, stripIndents } = require('common-tags');
const ReactTemplateCommand = require('../../bases/react/react-template');
const ForNumberPPBehavior = require('../../bases/react/for-number-pp-behavior');

module.exports = class ReactCommand extends ReactTemplateCommand {
	constructor(client) {
		super(
			client,
			{
				name: 'react',
				memberName: 'react',
				description: `Add reactions to a message.`,
				details: stripIndents`${oneLine`Add reactions to a message. Letters will automatically be
						converted to emojis.`}
					${oneLine`Optionally, specify how far back the message is you want to react to 
						(with 1 being the latest). **See examples.**`}
					${oneLine`For a more precise reaction, you can specify the number of messages back`}`,
				examples: [
					`To react to latest message: \`react i love u\``,
					`To react to fifth latest message: \`react 5 i love u :heart:\``
				],
				args: [
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
		const messages = await this._getMessages(msg);
		return this._getMessageFromMessages(msg, args.msgInd, messages);
	}
};
