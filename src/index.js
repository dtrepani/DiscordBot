'use strict';

const { oneLine } = require('common-tags');
const Commando = require('discord.js-commando');
const config = require('./assets/config.json');
const EventLogger = require('./events/event-logger');
const path = require('path');
const sqlite = require('sqlite');
const winston = require('winston');

if(process.env.NODE_ENV !== 'test') {
	winston.configure({
		transports: [
			new winston.transports.Console({
				level: 'debug',
				handleExceptions: true,
				colorize: true,
				prettyPrint: true
			})
		]
	});
}

const client = new Commando.Client({
	owner: config.owner,
	commandPrefix: config.prefix,
	unknownCommandResponse: false
});

EventLogger.init(client, path.join(__dirname, 'events/events'));

client
	.on('error', winston.error)
	.on('warn', winston.warn)
	.on('disconnect', event => {
		winston.warn(`Disconnected! [${event.code}]: ${event.reason || 'Unknown reason'}`);
		
		/** Restart Timothy using pm2 if he's been disconnected for more then a minute without reconnecting. */
		setTimeout(() => {
			process.exit();
		}, 60000);
	})
	.on('reconnect', () => {
		clearTimeout();
		winston.warn('Reconnecting...');
	})
	.on('ready', () => {
		clearTimeout();

		winston.info(oneLine`
			Client ready; logged in as
			${client.user.username}#${client.user.discriminator} (${client.user.id})`
		);

		client.user.setGame('Pikmin Crossing: Fashion Wars 2')
			.catch((err) => winston.err(err));
	})
	.on('commandPrefixChange', (guild, prefix) => {
		winston.info(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandError', (cmd, err) => {
		if(err instanceof Commando.FriendlyError) return;
		winston.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandRun', (cmd, promise, msg, args) => {
		winston.verbose(oneLine`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})
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
	})
	.on('guildDelete', (guild) => client.provider.clear(guild));
	
client.setProvider(
	sqlite.open(path.join(__dirname, config.db)).then(db => new Commando.SQLiteProvider(db))
).catch(winston.error);

client.registry
	.registerGroups([
		['mod', 'Mod Only'],
		['pkmn-spec', 'PKMN Specific'],
		['fun', 'Fun'],
		['fun-img', 'Fun: Random Images'],
		['tags', 'Tags'],
		['web', 'Web']
	])
	.registerDefaultTypes()
	.registerDefaultGroups()
	.registerDefaultCommands({ help: false })
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(config[process.env.NODE_ENV || 'development'].discord_token);

process.on('unhandledRejection', err => {
	winston.error(`Uncaught Promise Error: \n ${err.stack}`);
});
