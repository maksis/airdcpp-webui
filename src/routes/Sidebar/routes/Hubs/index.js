module.exports = {
	path: '/hubs',
	
	getChildRoutes(location, cb) {
		require.ensure([], (require) => {
			cb(null, [ {
				path: 'session/:id', 
				component: require('./components/HubSession'), 
			}, {
				path: 'new', 
				component: require('./components/HubNew'),
			} ]);
		}, 'hubs-children');
	},

	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/Hubs'));
		}, 'hubs');
	}
};

