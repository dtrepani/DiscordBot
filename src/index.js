'use strict';

const config = require('./assets/config.json');
const Commando = require('discord.js-commando');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const sqlite = require('sqlite');
const oneLine = require('common-tags').oneLine;
const Logger = require('./modules/logger');

const client = new Commando.Client({
	owner: config.owner,
	commandPrefix: config.prefix,
	unknownCommandResponse: false
});

const logger = new Logger(client, path.join(__dirname, 'events/events'));

winston.configure({
	transports: [
		new winston.transports.Console({
			level: "debug",
			handleExceptions: true,
			colorize: true,
			prettyPrint: true
		})
	]
});

// TODO: sqlite.clear(guild) when guild deleted
client
	.on('error', winston.error)
	.on('warn', winston.warn)
	.on('disconnect', () => { winston.warn('Disconnected!'); })
	.on('reconnect', () => { winston.warn('Reconnecting...'); })
	.on('ready', () => {
		winston.info(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);

		client.user.setGame('Pikmin Crossing: Fashion Wars 2')
			.then(() => {})
			.catch((err) => {
				winston.warn(`Error setting game: ${err}`);
			});
	})
	.on('commandPrefixChange', (guild, prefix) => {
		winston.info(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandError', (cmd, err) => {
		if (err instanceof Commando.FriendlyError) return;
		winston.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandRun', (cmd, promise, msg, args) => {
		winston.info(oneLine`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})
			> ${msg.guild ? `${msg.guild.name} (${msg.guild.id})` : 'DM'}
			>> ${cmd.groupID}:${cmd.memberName}
			${
				(Object.values(args)[0] !== '') 
					? (args instanceof Array) 
						? `>>> ${Object.values(args)}`
						: `>>> ${args}`
					: ''
			}
		`);
	});

client.setProvider(
	sqlite.open(path.join(__dirname, config.db)).then(db => new Commando.SQLiteProvider(db))
).catch(winston.error);

client.registry
	.registerGroups([
		['fun', 'Fun'],
		['tags', 'Tags'],
		['pkmn-spec', 'PKMN Specific'],
		['mod', 'Mod-Only']
	])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config.tokens.discord_test);

process.on("unhandledRejection", err => {
	winston.error("Uncaught Promise Error: \n" + err.stack);
});