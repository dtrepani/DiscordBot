'use strict';

module.exports = {
	capitalizeFirstLetter: str => str.charAt(0).toUpperCase() + str.slice(1),
	toTitleCase: str => str.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()),
	camelCaseToDash: str => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
	charToEmoji: char => {
		if(/[a-zA-Z]/.test(char)) {
			const hexToAdd = char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
			return String.fromCodePoint(0xd83c, (0xdde6 + hexToAdd));
		}

		if(/[0-9*#]/.test(char)) {
			return String.fromCodePoint(char.charCodeAt(0), 0x20e3);
		}

		const otherEmojis = {
			'!': '\u2757',
			'?': '\u2753',
			'.': '\u23fa'
		};

		if(otherEmojis.hasOwnProperty(char)) {
			return otherEmojis[char];
		}

		return '';
	}
};
