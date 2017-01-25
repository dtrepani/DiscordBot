'use strict';

const Commando = require('discord.js-commando');
const alerts = require('../../modules/alerts');

module.exports = class RollCommand extends Commando.Command {
	/**
	 * @typedef {Object} RollInfo
	 * @property {int} numOfDice
	 * @property {int} numSidedDice
	 */

	constructor(client) {
		const format = '[# of dice]d[#-sided dice]';

		super(client, {
			name: 'roll',
			group: 'fun',
			memberName: 'roll',
			description: `Roll them dice! :game_die:`,
			args: [
				{
					key: 'roll',
					prompt: `Roll what? (${format})`,
					type: 'string'
				}
			]
		});

		this.format = format;
	}

	async run(msg, args) {
		try {
			const rollInfo = this.parseRoll(args.roll);
			const diceRolls = this.rollAllDice(rollInfo);
			const rollTotal = diceRolls.reduce((roll1, roll2) => {
				return roll1 + roll2;
			}, 0);
			const diceRollsStr = ((diceRolls.length > 1)
				? `[${diceRolls.join(' + ')}]`
				: ``);

			return msg.reply(`${rollTotal.toLocaleString()} :game_die: ${diceRollsStr}`);
		} catch(err) {
			return alerts.sendError(msg, err);
		}
	}

	/**
	 * @returns {RollInfo}
	 */
	parseRoll(roll) {
		const dInd = roll.indexOf('d');
		if(dInd === -1) throw new Error(`Rolls must be in the format of ${this.format}.`);

		const numOfDice = parseInt(roll.substr(0, dInd));
		const numSidedDice = parseInt(roll.substr(dInd + 1));

		if(isNaN(numOfDice) || isNaN(numSidedDice)) {
			throw new Error(`One or both of those aren't numbers! Please use the format ${this.format}.`);
		}

		return {
			numOfDice: numOfDice,
			numSidedDice: numSidedDice
		}
	}


	/**
	 * @param {RollInfo} rollInfo
	 * @returns [int] Each dice roll
	 */
	rollAllDice(rollInfo) {
		let diceRolls = [];

		for(let i = 0; i < rollInfo.numOfDice; i++) {
			diceRolls.push(this.rollSingleDice(rollInfo.numSidedDice));
		}

		return diceRolls;
	}

	rollSingleDice(numSidedDice) {
		return Math.floor(Math.random() * numSidedDice) + 1;
	}
};