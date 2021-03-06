module.exports = async (client) => {
	const express = require('express');
	const app = express();
	const cookies = require('cookies');
	const bodyParser = require('body-parser');
    const path = require('path');
	const port = 3000;

	app.use('/public', express.static('public'));
	app.set('view engine', 'pug');
	app.set('views', path.join(__dirname, '../views'));
	app.use(cookies.express());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

    const authRoutes = require('./authorization');
    const rootRoutes = require('./root');
    const apiRoutes = require('./api');

    app.use('/',
        rootRoutes,
        authRoutes,
        apiRoutes
    );

	app.all('*', function(req, res) {
		if (req.url.toLowerCase().startsWith('/api')) {
			res.status(404);
			res.json({ error: 'Cannot find what you\'re looking for', data: null });
		} else {
			res.status(404);
			res.render('errors/404');
		}
	});

  	app.listen(port, () => console.log('Billybobbeep is online'));
}