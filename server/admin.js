var assert = require('assert');
var uuid = require('uuid');
var async = require('async');
var range = require('range-gen')
var checkAuth = require('./middlewares.js');
isAdmin = checkAuth.checkAuth;

function postLogin(app){
    app.post('/signin', function(req, res){
        console.log('POST LOGIN');
        var post = req.body;
        console.log(post);
        if(post.user === 'admin' && post.password === 'Password1paris'){
            req.session.user_id = 0123456789;
            res.redirect('/admin');
        } else {
            res.send('Bad user / pass');
        }
    });
}
exports.postLogin = postLogin;

function getLogout(app){
    app.get('/logout', isAdmin, function(req, res){
        console.log('GET LOGOUT');
        delete req.session.user_id;
        console.log(req.session.user_id);
        return res.redirect('/login/');
    });
}
exports.getLogout = getLogout;

function getAdminLogin(app){
    app.get('/login', function(req, res){
        console.log('GET SIGNIN');
        return res.render('signin');
    })
}
exports.getAdminLogin = getAdminLogin;

function getAdmin(app, db){
    app.get('/admin', isAdmin, function(req, res, next) {
        console.log('GET ADMINDASHBOARD');
        var array = [];
        var arrayContact = [];
        var arrayBooking = [];
        var cursor = db.collection('ARTICLE').find();
        if(cursor != null){
            cursor.toArray(function(err, doc) {
                if (err) return next(err);
                else{
                    for(var i in doc){
                        var x = {
                            _id : doc[i]._id,
                            name : doc[i].name,
                            img : doc[i].img,
                            sound : doc[i].sound
                        };
                        array.push(x);
                    }
                }
            });
        }
        var contact = db.collection('CONTACT').find();
        if(contact != null){
            contact.toArray(function(err, doc) {
                if (err) return next(err);
                else{
                    for(var i in doc){
                        var x = {
                            _id : doc[i]._id,
                            name : doc[i].name,
                            email : doc[i].email,
                            phone : doc[i].phone,
                            message : doc[i].message
                        };
                        console.log('message '+i+' : '+x._id);
                        arrayContact.push(x);
                    }
                }
            });
        }
        var booking = db.collection('BOOKING').find();
        if(booking != null){
            booking.toArray(function(err, doc) {
                if (err) return next(err);
                else{
                    for(var i in doc){
                        var x = {
                            _id : doc[i]._id,
                            name : doc[i].name,
                            email : doc[i].email,
                            phone : doc[i].phone,
                            mobile : doc[i].mobile,
                            lastname : doc[i].lastname,
                            date : doc[i].date,
                            venue : doc[i].venue,
                            address : doc[i].address,
                            artist : doc[i].artist,
                            state : doc[i].state
                        };
                        console.log('booking '+i+' : '+x._id);
                        arrayBooking.push(x);
                    }
                }
            });
        }     
        return res.render('admin', {
                article : array || false,
                contact : arrayContact || false,
                booking : arrayBooking || false    
        });
        
    })
}
exports.getAdmin = getAdmin;

function postContact(app, db){
    app.post('/contact', function(req, res, next){
        var collection = db.collection('CONTACT');
        var data = {
            name : req.body.fname,
            email : req.body.email,
            phone : req.body.phone,
            message : req.body.message,
            _id : uuid.v1()
        };
        console.log(data);
        console.log("MESSAGE SENDED : ",data._id);
        if(data != null){
            collection.save(data, function(err, record){
                        console.log("Record added");
            });
        }
        return res.redirect('/contact/');
    })
}
exports.postContact = postContact;

function deleteContact(app, db){
    app.post('/contact/delete', isAdmin, function(req, res, next){
    console.log('delete contact ',req.body.id);
        if(typeof req.body.id != 'undefined')
            db.collection('CONTACT').remove({_id: req.body.id});
        return res.redirect('/admin');
    });
}
exports.deleteContact = deleteContact;

function postBooking(app, db){
    app.post('/booking', function(req, res, next){
        var collection = db.collection('BOOKING');
        var data = {
            artist : req.body.artist,
            state : req.body.state,
            address : req.body.address,
            venue : req.body.venue,
            date : req.body.date,
            email : req.body.email,
            phone : req.body.phone,
            mobile : req.body.mobile,
            lastname : req.body.lastname,
            name : req.body.fname,
            _id : uuid.v1()
        };
        console.log(data);
        console.log('BOOKING SENDED: ',data._id);
        if(data != null){
            collection.save(data, function(err, record){
                console.log("Record added");
            });
        }
        return res.redirect('/booking/');
    })
}
exports.postBooking = postBooking;

function deleteBooking(app, db){
    app.post('/booking/delete', isAdmin, function(req, res, next){
	console.log('delete booking ',req.body.id);
        if(typeof req.body.id != 'undefined')
            db.collection('BOOKING').remove({_id: req.body.id});
        return res.redirect('/admin');
    });
}
exports.deleteBooking = deleteBooking;

function saveArticle(app, db){
    app.post('/admin/artist/save',isAdmin, function (req, res, next) {
        var collection = db.collection('ARTICLE');
        var article = decodeURIComponent(req.body.article);
        var name = req.body.name;
        var img = req.body.img;
        var sound = req.body.sound;
        var _id = uuid.v1();
        var data = {
            article: article,
            name : name,
            _id : _id,
            img : img,
            sound : sound,
            post : "false"
        };
        var result = db.collection('ARTICLE').find({name: data.name});
        console.log('artist created', _id);
        if(result != null){
            result.next(function (err, doc) {
                if(err) return next(err);
                if (doc != null) {
                    if (doc.name == data.name) {
                        db.collection('ARTICLE').update({"name": data.name}, {$set: {"article": data.article}}, {$set: {"img": data.img}}, {$set: {"sound": data.sound}});
                        return res.redirect('/admin/');
                    }
                }else{
                    console.log("save new doc");
                    collection.save(data, function(err, record){
                        console.log("Record added");
                    });
                    return res.redirect('/admin');
                }
            });
        }else{
            return res.redirect('/admin/');
        }
    })
}
exports.saveArticle = saveArticle;

function getArticle(app, db){
    app.get('/artist/:id', function(req, res, err) {
        var articleID= req.params.id;
        var collection = db.collection('ARTICLE');
        console.log("get article ",articleID);
        collection.findOne({
          "_id": articleID
        }, function (err, item) {
            if(err) return next(err);
            if(item!=null){
                var data = {
                    _id : item._id,
                    article : item.article,
                    img : item.img,
                    name : item.name,
                    sound : decodeURIComponent(item.sound)
                };
                console.log(data.sound);
                
                    return res.render('article', {
                        article: data
                    });
            }
            res.redirect('/');
        });


    })
}
exports.getArticle = getArticle;

function getArticleEditor(app){
    app.get('/artist', isAdmin, function(req, res) {
        return res.render('articleEditor',{
            article : false,
            name : false,
            img : false,
            sound : false
        });
    })
}
exports.getArticleEditor = getArticleEditor;



function editArticle(app, db){
    app.get('/admin/artist/editArticle', isAdmin, function(req, res, next){
        var _id = req.query.id;
        console.log("Searching for "+_id);
        var result = db.collection('ARTICLE').find({"_id" : _id});
        if(result != null){
            result.next(function(err, doc) {
                if (err) return next(err);
                if(doc != null && typeof doc._id != 'undefined'){
                    console.log("render articleEditor");
                    return res.render('articleEditor',{
                        article : doc.article || false,
                        name : doc.name || false,
                        img : doc.img || false,
                        sound : doc.sound || false
                    });
                }else{
                // TODO: Redirect avec message d'erreur
                return res.render('error');
            }
        });
        }else{
            return res.render('articleEditor', {
                article: false,
                name: false,
                img: false,
                sound : false
            });
        }
    });
}
exports.editArticle = editArticle;

function deleteArticle(app, db){
    app.get('/admin/artist/deleteArticle', isAdmin, function(req, res, next){
        if(typeof req.query.id != 'undefined')
            db.collection('ARTICLE').remove({_id: req.query.id});
        return res.redirect('/admin');
    });
}
exports.deleteArticle = deleteArticle;

function postArticle(app, db ){
    app.get('/admin/artist/postArticle', isAdmin, function(req, res, next){
        if(typeof req.query.id != 'undefined') {
            var _id = req.query.id;
            db.collection('ARTICLE').update({"_id": _id}, {$set: {"post": "true"}});
            var cursor = db.collection('ARTICLE').find();
            if(cursor != null){
                cursor.toArray(function (err, doc) {
                    if (err) return next(err);
                    else {
                        doc = doc.filter(function (v) {
                            return v.post === "true";
                        })
                        return res.redirect('/admin');
                    }
                });
            }else{
                return res.redirect('/error');
            }
        }else{
            return res.redirect('/admin');
        }
    });
}
exports.postArticle = postArticle;




