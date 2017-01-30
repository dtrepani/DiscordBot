/* eslint-disable no-irregular-whitespace */
'use strict';

const Commando = require('discord.js-commando');
const cleanReply = require('../../modules/clean-reply');
const { oneLine } = require('common-tags');
const fs = require('fs');

module.exports = class GoodShitCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'good-shit',
			group: 'fun',
			memberName: 'good-shit',
			description: '👌👌 👌 💯 👌 👀 👀 👀 👌👌'
		});
	}

	async run(msg) {
		try {
			const list = JSON.parse(fs.readFileSync('src/assets/good-shit.json'));
			const output = list[Math.floor(Math.random() * list.length)];
			return cleanReply(msg, output);
		} catch(err) {
			return cleanReply(msg, oneLine`👌👀👌👀👌👀👌👀👌👀 good shit go౦ԁ sHit👌 thats ✔ some good👌👌shit 
				right👌👌th 👌 ere👌👌👌 right✔there ✔✔if i do ƽaү so my selｆ 💯 i say so 💯 thats what im talking 
				about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ💯 👌👌 👌НO0ОଠＯOOＯOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ👌 
				👌👌 👌 💯 👌 👀 👀 👀 👌👌Good shit`);
		}
	}
};
