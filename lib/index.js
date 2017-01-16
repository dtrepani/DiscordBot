'use strict';

const config = require('../config.json');
const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const path = require('path');
const sqlite = require('sqlite');

const client = new Commando.Client({
	owner: config.owner,
	commandPrefix: config.prefix
});

client
	.on('error', console.error)
	.on('warn', console.warn)
	//.on('debug', console.log)
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnect', () => { console.warn('Reconnecting...'); })
	.on('commandError', (cmd, err) => {
		if (err instanceof Commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('ready', () => {
		console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);

		client.user.setGame('Pokemon Crossing: Fashion Wars')
			.then(() => {})
			.catch((err) => {
				console.error(`Error setting game: ${err}`);
			});
	});

client.setProvider(
	sqlite.open(path.join(__dirname, config.db)).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.registry
	.registerGroups([
		['fun', 'Fun'],
		['pkmn', 'PKMN Specific']
	])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config.token);

process.on("unhandledRejection", err => {
	console.error("Uncaught Promise Error: \n" + err.stack);
});
