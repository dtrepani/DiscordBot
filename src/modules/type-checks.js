'use strict';

module.exports = {
	isUrl: item => (item.search(/https?:\/\/[^ /.]+\.[^ /.]+/) !== -1),
	isString: str => typeof str === 'string' || str instanceof String,
	isNumber: number => (!isNaN(number) && isFinite(number)),
	isSplatRole: role => {
		const splatPrefix = 'Splat ';
		return role.name.substr(0, splatPrefix.length) === splatPrefix;
	},
	isJarpyNickname: nickname => {
		if(!nickname) {
			return false;
		}

		const hearts = '💕';
		// +1 accounts for the space on either side of the nickname.
		const heartsLength = hearts.length + 1;

		const startOfNick = nickname.substr(0, heartsLength);
		const endOfNick = nickname.substr(nickname.length - heartsLength);

		return (startOfNick === `${hearts} ` && endOfNick === ` ${hearts}`);
	}
};
