'use strict';

const stripIndents = require('common-tags').stripIndents;
const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const sqlite = require('sqlite');
const alerts = require('../../modules/alerts');

// TODO: concat keys with only one url when randomly choosing keys
module.exports = class PKMNCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'pkmn',
			aliases: ['pokemon', 'pikmin'],
			group: 'pkmn-spec',
			memberName: 'pkmn',
			description: 'Gets information about a user.',
			argsType: 'multiple',
			examples: [
				'~pkmn Lhu',
				'~pkmn add http://i.imgur.com/f75Pzvn.jpg lhu kyuu moto vara arrow perry jessu',
				'~pkmn remove http://i.imgur.com/f75Pzvn.jpg',
				'~pkmn remove http://i.imgur.com/f75Pzvn.jpg lhu kyuu'
			]
		});

	}

	async run(msg, args) {
		this.pkmnUrls = this.client.provider.get(
			'global',
			'pkmn',
			JSON.parse(fs.readFileSync('lib/assets/pkmn.json'))
		);

		if(msg.author.id === '73687971546542080') {
			msg.reply('MYTHA NO.');
		}

		if (args.length === 0) return this.showRandomUrl(msg);
		else {
			switch (args[0].toLowerCase()) {
				case "add": return this.addUrl(msg, args);
				case "remove": return this.removeUrl(msg, args);
				case "output": return this.outputUrls(msg);
				case "help": return this.listHelp(msg);
				default: return this.showRandomUrlFromKey(msg, args);
			}
		}
	}

	listHelp(msg) {
		let embed = alerts.getHelpEmbed('PKMN Command Help');
		embed
			.addField('❯ Syntax', stripIndents`
				URLs must begin with "http". Parameters in brackets are optional. The output command is used to get a JSON string of all urls.
				\`\`\`• pkmn <name>
				• pkmn add <url> <name1>[ <name2> ...]
				• pkmn remove <url> [<name1> ...]
				• pkmn output\`\`\`
			`)
			.addField('❯ Examples', stripIndents`
				\`\`\`• ~pkmn add http://i.imgur.com/f75Pzvn.jpg lhu kyuu moto vara arrow perry jessu
				• ~pkmn remove http://i.imgur.com/f75Pzvn.jpg
				• ~pkmn remove http://i.imgur.com/f75Pzvn.jpg lhu kyuu\`\`\`
			`)
			.addField('❯ Keys In Use', `\`\`\`${Object.keys(this.pkmnUrls).join(", ")}\`\`\``);

		return alerts.sendHelp(msg, embed);
	}

	deleteMsg(msg) {
		msg.delete(2000);
	}

	hasUrl(url) {
		return (url !== undefined && url.slice(0, 4) === "http");
	}

	addUrl(msg, args) {
		if (!this.hasUrl(args[1]) || args[2] === undefined) {
			return alerts.sendError(msg, `Please use the format "add <url> <name1> [<name2>] ...\ to add a picture.`);
		}

		return this.pushUrlToKeys(msg, args);
	}

	pushUrlToKeys(msg, args) {
		var url = args[1];
		var errorKeys = [];

		for (var i = 2; i < args.length; i++) {
			var key = args[i];

			if (this.pkmnUrls.hasOwnProperty(key)) {
				if (this.pkmnUrls[key].indexOf(url) === -1) this.pkmnUrls[key].push(url);
				else {
					errorKeys.push(key);
				}
			} else this.pkmnUrls[key] = [url];
		}

		this.client.provider.set('global', 'pkmnUrls', this.pkmnUrls)
			.catch(winston.error);

		if (errorKeys.length === 0) {
			this.deleteMsg(msg);
			return msg.reply("`" + args[1] + "` was added to " + args.slice(2).join(", "));
		}
		return alerts.sendError(msg, "`" + args[1] + "` is already in " + errorKeys.join(", "));
	}

	removeUrl(msg, args) {
		if (!this.hasUrl(args[1])) {
			return alerts.sendError(msg, `Please use the format "remove <url> [<name1>] [<name2>] ..." to remove a picture.`);
		}

		return this.removeUrlFromKeys(msg, args);
	}

	removeUrlFromKeys(msg, args) {
		var vm = this;
		var url = args[1];
		var keysErrorInvalidUrl = [];
		var keysErrorInvalidKey = [];

		if (args[2] === undefined) removeUrlFromAllKeys();
		else removeUrlFromSpecificKeys();

		this.client.provider.set('global', 'pkmnUrls', vm.pkmnUrls)
			.catch(winston.error);

		if (keysErrorInvalidUrl.length > 0) return alerts.sendError(msg, "`" + url + "` does not exist in " + keysErrorInvalidUrl.join(", "), true);
		if (keysErrorInvalidKey.length > 0) return alerts.sendError(msg, "Invalid key(s): " + keysErrorInvalidKey.join(", "), true);
		if (keysErrorInvalidKey.length === 0 && keysErrorInvalidUrl.length === 0) {
			var removedFromMsg = (args[2] === undefined)
				? "."
				: " from " + args.slice(2).join(", ");

			this.deleteMsg(msg);
			return msg.reply("`" + args[1] + "` was removed" + removedFromMsg);
		}

		function removeUrlFromAllKeys() {
			for (var key in vm.pkmnUrls) {
				removeFromKey(key);
			}
		}

		function removeUrlFromSpecificKeys() {
			for (var i = 2; i < args.length; i++) {
				var key = args[i];

				if (vm.pkmnUrls.hasOwnProperty(key)) {
					if (!removeFromKey(key)) keysErrorInvalidUrl.push(key);
				} else keysErrorInvalidKey.push(key);
			}
		}

		function removeFromKey(key) {
			var urlIndex = vm.pkmnUrls[key].indexOf(url);

			if (urlIndex !== -1) {
				vm.pkmnUrls[key].splice(urlIndex, 1);

				if (vm.pkmnUrls[key].length === 0) {
					delete vm.pkmnUrls[key];
				}

				return true;
			}

			return false;
		}
	}

	outputUrls(msg) {
		msg.author.sendMessage(JSON.stringify(this.pkmnUrls), { split: {char: ',', append: ','} } )
			.catch(winston.error);
		return msg.reply("Check your messages for a list of URLs.");
	}

	showRandomUrl(msg) {
		var keys = Object.keys(this.pkmnUrls);
		var urlKey = this.getRandomOutputForArray(keys);
		return msg.say(this.getRandomOutputForArray(this.pkmnUrls[urlKey]));
	}

	showRandomUrlFromKey(msg, args) {
		var keys = Object.keys(this.pkmnUrls);
		var urlKey = args[0];
		if (this.pkmnUrls.hasOwnProperty(urlKey)) return msg.say(this.getRandomOutputForArray(this.pkmnUrls[urlKey]));
		return alerts.sendError(msg, "`" + args[0] + "` is not a valid key or command. Use `~pkmn help` for a list of commands and keys available.");
	}

	getRandomOutputForArray(arr) {
		return (arr && arr.length > 0)
			? arr[Math.floor(Math.random() * arr.length)]
			: "";
	}
};
