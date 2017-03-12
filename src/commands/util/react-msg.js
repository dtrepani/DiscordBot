'use strict';

const { oneLine } = require('common-tags');
const ReactTemplateCommand = require('../../bases/react/react-template');
const ParseParamsBehavior = require('../../bases/react/parse-params-behavior');

module.exports = class ReactMsgCommand extends ReactTemplateCommand {
	constructor(client) {
		super(
			client,
			{
				name: 'react-msg',
				aliases: ['react-message', 'react-id'],
				memberName: 'react-msg',
				description: `Add reactions to a message using the message ID.`,
				details: oneLine`Add reactions to a specific message. Letters will automatically be 
					converted to emojis.`,
				examples: [`react-msg 289859024097378304 i love u`],
				args: [
					{
						key: 'msgID',
						prompt: 'What message ID are you reacting to?',
						type: 'string'
					},
					{
						key: 'reaction',
						prompt: 'How would you like to react?',
						type: 'string'
					}
				]
			},
			new ParseParamsBehavior()
		);
	}

	/** @override */
	async _getMessageToReactTo(msg, args) {
		const messages = (await this._getMessages(msg));
		return messages.get(args.msgID);
	}
};
