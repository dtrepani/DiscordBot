'use strict';

const { isNumber } = require('../../modules/type-checks');
const cleanReply = require('../../modules/clean-reply');
const Commando = require('discord.js-commando');
const sendError = require('../../modules/send-error');

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
			description: 'Roll them dice! :game_die:',
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
			const rollInfo = this._parseRoll(args.roll);
			const diceRolls = this._rollAllDice(rollInfo);
			const rollTotal = diceRolls.reduce((roll1, roll2) => (roll1 + roll2), 0);
			const diceRollsStr = ((diceRolls.length > 1)
				? `[${diceRolls.join(' + ')}]`
				: ``);

			return cleanReply(msg, `${rollTotal.toLocaleString()} :game_die: ${diceRollsStr}`);
		} catch(err) {
			return sendError(msg, err);
		}
	}

	/**
	 * @param {String} roll
	 * @returns {RollInfo}
	 */
	_parseRoll(roll) {
		const dInd = roll.indexOf('d');
		if(dInd === -1) throw new Error(`Rolls must be in the format of ${this.format}.`);

		const numOfDice = parseInt(roll.substr(0, dInd));
		const numSidedDice = parseInt(roll.substr(dInd + 1));

		if(!isNumber(numOfDice) || !isNumber(numSidedDice)) {
			throw new Error(`One or both of those aren't numbers! Please use the format ${this.format}.`);
		}

		return {
			numOfDice: numOfDice,
			numSidedDice: numSidedDice
		};
	}

	/**
	 * @param {RollInfo} rollInfo
	 * @returns {integer} Each dice roll
	 */
	_rollAllDice(rollInfo) {
		const diceRolls = [];

		for(let i = 0; i < rollInfo.numOfDice; i++) {
			diceRolls.push(this._rollSingleDice(rollInfo.numSidedDice));
		}

		return diceRolls;
	}

	_rollSingleDice(numSidedDice) {
		return Math.floor(Math.random() * numSidedDice) + 1;
	}
};
