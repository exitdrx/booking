
 function renderHome(app, db){
    app.get('/', function (req, res) {
        var array = [];
        var cursor = db.collection('ARTICLE').find();
        if(cursor != null){
            cursor.toArray(function(err, doc) {
                if (err) return next(err);
                else{
                    for(var i in doc){
                        var x = {
                            _id : doc[i]._id,
                            name : doc[i].name,
                            img : doc[i].img
                        };
                        array.push(x);
                    }
                }
            });
        }
         return res.render('index', {
            artist : array || false
         });
    });
}
exports.renderHome = renderHome;

function renderArtists(app, db){
    app.get('/artists', function(req, res) {
        var array = [];
        var cursor = db.collection('ARTICLE').find();
        if(cursor != null){
            cursor.toArray(function(err, doc) {
                if(err) return next(err);
                else{
                    for(var i in doc){
                        var x = {
                            _id : doc[i]._id,
                            name : doc[i].name,
                            img : doc[i].img,
                        };
                        array.push(x);
                    }
                }
            });
        }
        return res.render('artists', {
            artists : array || false
        });
    });
}
exports.renderArtists = renderArtists;

function renderContact(app){
    app.get('/contact', function(req, res){
        return res.render('contact');
    });
}
exports.renderContact = renderContact;

function renderBooking(app, db){
    app.get('/booking', function(req, res){
        var array = [];
        var cursor = db.collection('ARTICLE').find();
        if(cursor != null){
            cursor.toArray(function(err, doc) {
                if (err) return next(err);
                else{
                    for(var i in doc){
                        var x = {
                            _id : doc[i]._id,
                            name : doc[i].name,
                        };
                        array.push(x);
                    }
                }
            });
        }
        return res.render('booking',{
            artist : array || false
        });
    });
}
exports.renderBooking = renderBooking;

function renderErrorNotFound(app){
    app.use(function(req, res, next){
      res.status(404);

      if(req.accepts('hbs')){
        res.render('error');
        return;
    }
    res.type('txt').send('Not found');
});
}
exports.renderErrorNotFound = renderErrorNotFound;

function renderInternError(app){
    app.use(function(req, res, next){
    	res.status(500);

    	if(req.accepts('hbs')){
        	res.render('error');
        	return;
    	}

    	res.type('txt').send('Something broke');
	});
}
exports.renderInternError = renderInternError;