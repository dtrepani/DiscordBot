'use strict';

const Commando = require('discord.js-commando');
const winston = require('winston');
const commonTags = require('common-tags');
const fs = require('fs');
const sqlite = require('sqlite');
const alerts = require('../../modules/alerts');

module.exports = class AddToCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'add-to',
			aliases: ['add'],
			group: 'tags',
			memberName: 'add-to',
			description: commonTags.oneLine`Add URLs to PKMN, dgc, hickory, or "guess i'll" lists; 
				or add tags to the tag list.`,
			examples: [
				'add-to pkmn http://i.imgur.com/7yRK0kb.jpg mytha cyg arrow',
				'add-to dgc http://i.imgur.com/ZXnyVMI.jpg',
				'add-to tags what-up "What is up? B^)"'
			],

			args: [
				{
					key: 'listName',
					prompt: 'What list would you like to add to?',
					type: 'string'
				},
				{
					key: 'addition',
					prompt: 'What would you like to add to the list? If adding to tags, this would be the tag name.',
					type: 'string'
				},
				{
					key: 'attachment',
					prompt: 'What tags or snippet would you like to add?',
					type: 'string',
					default: ''
				}
			]
		});

	}

	async run(msg, args) {
		winston.debug(args);
		switch(args.listName.toLowerCase()) {
			case "pkmn":
				return this.addToPkmnList(msg, args);
			case "dgc":
			case "hickory":
				return this.addToUrlList(msg, args);
			case "tags":
				return this.addToTagsList(msg, args);
			default:
				return alerts.sendError(
					msg,
					`${args.listName} is not a valid list name. See \`help add-to\` for available list names.`
				);
		}
	}

	addUrl(msg, args, list) {
		const url = args.addition;
		const errMsg = this.checkUrlForErrors(msg, url);

		if (errMsg) {
			return errMsg;
		}

		if(list.indexOf(url) !== -1) {
			return alerts.sendError(msg, `${url} is already in ${args.listName}`);
		}

		list.push(args.addition);
		this.setList(args.listName);

		msg.delete(2000);
		return msg.reply(`${url} was added to ${args.listName}.`);
	}

	addUrlWithTags(msg, args, list) {
		const url = args.addition;
		const urlErrMsg = this.checkUrlForErrors(msg, url);

		if (urlErrMsg) {
			return urlErrMsg;
		}

		return this.pushUrlToKeys(msg, args, list);
	}

	// TODO: create json files for each of the main lists
	getList(listName) {
		return this.client.provider.get(
			'global',
			listName,
			(listName === "pkmn")
				? JSON.parse(fs.readFileSync('lib/assets/pkmn.json'))
				: []
		);
	}

	pushUrlToKeys(msg, args, list) {
		const url = args.addition;
		const tags = args.attachment;
		let errorKeys = [];

		tags.forEach(tag => {
			if (list.hasOwnProperty(tag)) {
				if (list[tag].indexOf(url) === -1) list[tag].push(url);
				else {
					errorKeys.push(tag);
				}
			} else list[tag] = [url];
		});
		
		this.setList(args.listName, list);

		if (errorKeys.length === 0) {
			msg.delete(2000);
			return msg.reply(`\`${url}\` was added to \`${args.listName}\` with tags: \`${tags.slice(0).join(", ")}\``);
		}
		return alerts.sendError(msg, "`" + tags[0] + "` is already in " + errorKeys.join(", "));
	}

	checkUrlForErrors(msg, url) {
		if (url !== undefined && url.slice(0, 4) === "http") {
			return false;
		}

		return alerts.sendError(msg, `${url} is not a valid URL. See \`help add-to\` for available list names.`);
	}

	setList(listName, list) {
		this.client.provider.set('global', listName, list)
			.catch(winston.error);
	}

	addToPkmnList(msg, args) {
		let list = this.getList(args.listName);
		if(args.attachment) {
			args.attachment = args.attachment.split(" ");
		}
		return this.addUrlWithTags(msg, args, list);
	}

	addToUrlList(msg, args) {
		let list = this.getList(args.listName);
		return this.addUrl(msg, args, list);
	}
}