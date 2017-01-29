'use strict';

module.exports = {
	capitalizeFirstLetter: str => str.charAt(0).toUpperCase() + str.slice(1),
	toTitleCase: str => str.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()),
	camelCaseToDash: str => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
};
