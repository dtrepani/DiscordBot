module.exports = () => {
	process.env.NODE_ENV = 'test'; // eslint-disable-line no-process-env

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
