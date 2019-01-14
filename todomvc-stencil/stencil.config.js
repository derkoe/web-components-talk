exports.config = {
	bundles: [
		{ components: ['todomvc-stencil'] }
	],
	namespace: 'todo',
	outputTargets: [
		{
			type: 'www',
			baseUrl: '/stencil-todomvc'
		},
		{
			type: 'dist'
		}
	]
};

exports.devServer = {
	root: 'www',
	watchGlob: '**/**'
}
