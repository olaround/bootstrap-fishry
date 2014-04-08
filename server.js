
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var azure = require('azure');
var fs = require('fs');
/*var gm = require('gm');*/
var formidable = require('formidable');


var app = express();
app.configure(function () {
  app.use(express.bodyParser({limit: '10mb'}));
});



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'public/theme/views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public/theme/base')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.all('*', function(req, res, next) {
	app.locals.store = '12345';
  next()
})
app.get('/', routes.index);
app.get('/product', routes.product);
app.get('/product/:id', routes.product_any);
app.get('/collection-list', routes.collection_list);
app.get('/collections', routes.collection);
app.get('/collections/:id', routes.collection);
app.get('/page', routes.page);
app.get('/page/:id', routes.page);
app.get('/search', routes.search_page);
app.get('/cart', routes.cart);
app.get('/signup', routes.signup);
app.get('/login', routes.login);
app.get('/account', routes.account);
app.get('/checkout', routes.checkout);
app.get('/confirm', routes.confirm_screen);
app.get('/thankyou', routes.thankyou);

app.get('/:any', routes.notFound);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});




//console.log(azure);
