var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var DB_URL = process.env.DB_URL || 'mongodb://artistbooking@localhost:27017/artistbooking';
var PORT = process.env.PORT || 9998;
var session = require('express-session');
var mongodb = require('mongodb');
var MongoStore = require('connect-mongo')(session);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var DATA_COLLECTION = 'DATA';
var hbs = require('hbs');
var morgan = require('morgan');
var path = require('path');
var passport = require('passport');
var handelbars = require('./server/handelbars.js');
var renderPage = require('./server/renderPage.js');
var admin = require('./server/admin.js');




MongoClient.connect(DB_URL, function(err, db) {
	if(err) 
		throw err;
	initServer(db);
	console.log('Server connected on :9998');
})

function initServer(db){
	app.use(morgan('dev'));
	app.use(express.static(path.join("front", "public")));
	app.use(session({
		store : new MongoStore({
			url: DB_URL,
		}),
		secret: 'jeunerakza3fanearatchouchwya'
	}));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(require('connect-flash')());
	handelbars.registerHelperEval(hbs);
	handelbars.registerHelperStringify(hbs);
	handelbars.registerHelperSize(hbs);
	handelbars.registerHelperDebug(hbs);
	hbs.registerPartials(path.join(__dirname,"front", "views", "partials"));
	hbs.registerHelper("first", function(context, options) {
		console.log(context[0]);
		return options.fn(context[0]);
	});
	app.set('view engine', 'hbs');
	app.set('views', path.join(__dirname,"front", "views"));

	///////////////* RENDERS */
	renderPage.renderHome(app, db);
	renderPage.renderContact(app);
	renderPage.renderBooking(app, db);
	renderPage.renderArtists(app, db);
	//////////////* ADMIN */
	

	admin.saveArticle(app, db);
	admin.getArticle(app, db);
	admin.getArticleEditor(app, db);
	admin.editArticle(app, db);
	admin.deleteArticle(app, db);
	admin.postArticle(app, db);
	admin.postContact(app, db);
	admin.postBooking(app, db);

	admin.getAdminLogin(app);
	admin.postLogin(app);
	admin.getAdmin(app, db);
	admin.getLogout(app);

	renderPage.renderErrorNotFound(app);
	renderPage.renderInternError(app);

	server.listen(9998);
}


