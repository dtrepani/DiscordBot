module.exports = () => { // eslint-disable-line arrow-body-style
	return {
		files: [
			'src/**/*.js'
		],

		tests: [
			'test/**/*spec.js'
		],

		env: {
			type: 'node',
			params: { runner: '--harmony' }
		}
	};
};
