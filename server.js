
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
var url = require('url');
// var unzip = require('unzip');
var request = require('request');
var app = express();


app.configure(function () {
  //////console.log(process.env.PORT);
  app.use(express.bodyParser({limit: '10mb'}));
  app.use(function(req,res,next){
     if (/[A-Z]/.test(req.url)) {
         res.redirect(301, req.url.toLowerCase());
     } else {
         next();
     }
 });
  app.set('port', process.env.PORT || 3000);
  //for live
/*  app.set('WEB_ADDRESS', process.env.WEB_ADDRESS || 'fishry');
  app.set('MOBILE_SERVICE_NAME', process.env.MOBILE_SERVICE_NAME || 'fishry');
  app.set('MOBILE_SERVICE_KEY', process.env.MOBILE_SERVICE_KEY || 'egepBriQNqIKWucZFzqpQOMwdDmzfs16');*/
  
  
  //for beta
  app.set('WEB_ADDRESS', process.env.WEB_ADDRESS || 'atequator');
  app.set('MOBILE_SERVICE_NAME', process.env.MOBILE_SERVICE_NAME || 'fishry-beta');
  app.set('MOBILE_SERVICE_KEY', process.env.MOBILE_SERVICE_KEY || 'TYjZBNOSPGjvycjjiiAelNoZpqDxbL77');
  


  app.use(express.compress());
  //console.log(app.get('WEB_ADDRESS'));
  app.use(function(req, res, next) {
	  ////console.log(req.get('host')+ '------bda============');
	 if(req.get('host') == app.get('WEB_ADDRESS')+'.com' || req.get('host') == app.get('WEB_ADDRESS')+'.com:3000'){
	 	res.redirect('http://www.'+app.get('WEB_ADDRESS')+'.com' + req.originalUrl);
	 }else if(req.get('host').indexOf('www.') >= 0 && req.get('host').indexOf(app.get('WEB_ADDRESS')+'.') >= 0 && req.get('host') != 'www.'+app.get('WEB_ADDRESS')+'.com'){
		 var newHost = req.get('host').replace('www.','');
	 	 res.redirect('http://'+newHost + req.originalUrl);
	 }/*else if(req.get('host').indexOf('www.') < 0){
	 	 res.redirect('http://www.' + req.get('host') + req.originalUrl);
		 //Testing One two there
	 }*/
	 
		  req.setMaxListeners(0);
		  var url = req.protocol + '://' + req.get('host') + req.originalUrl;
		   var BaseUrl = req.get('host').split('.');
		        	  app.locals.domainUrl = req.get('host');
					  if(BaseUrl[0] == app.get('WEB_ADDRESS')){
						BaseUrl[0] = 'demo';
					  }
					  if(req.get('host') == 'www.'+app.get('WEB_ADDRESS')+'.com' || req.get('host') == 'www.'+app.get('WEB_ADDRESS')+'.com:3000'){
						app.locals.store = '12345';						
						app.locals.ThemeFolder = 'public/frontend/';
						app.locals.ThemeFolderPath =  'public/frontend/';
						app.locals.ThemeFolderPathBase =   'frontend/';
						app.locals.ThemeFolderPathBaseAdmin =  'public/frontend/';
						app.locals.EjsFilePath =  'home/views/';
					  }else{
						app.locals.store = '12345';
						app.locals.ThemeFolder = 'public/themes/'+BaseUrl[0]+'/';
						app.locals.ThemeFolderPath =  'public/themes/'+BaseUrl[0]+'/active/views/';
						app.locals.ThemeFolderPathBase =  '/themes/'+BaseUrl[0]+'/active/base/';	
						app.locals.ThemeFolderPathBaseAdmin =  '/themes/'+BaseUrl[0]+'/active/base/partials/';	
						app.locals.EjsFilePath = 'themes/'+BaseUrl[0]+'/active/views/';
						app.locals.storeName = BaseUrl[0];
						
					  }
	
		  var BaseUrl = req.get('host').split('.');
					  if(url.indexOf('admin') < 0 ){
						app.set('views', path.join(__dirname, 'public'));
						app.use(express.static(path.join(__dirname, 'public')));
						app.set('view engine', 'ejs');
						app.use(express.favicon());
						app.use(express.logger('dev'));
						app.use(express.json());
						app.use(express.urlencoded());
						app.use(express.methodOverride());
						app.use(app.router);
					  }else{
						app.set('views', path.join(__dirname, 'views'));
						app.use(express.static(path.join(__dirname, 'public')));
						app.set('view engine', 'ejs');
						app.use(express.favicon());
						app.use(express.logger('dev'));
						app.use(express.json());
						app.use(express.urlencoded());
						app.use(express.methodOverride());
						app.use(app.router);
					  }
		  next()
})

});

//sitemap.generate(app);
/*fs.createReadStream('data/1013.zip').pipe(unzip.Extract({ path: 'data/bda' }));*/

////////console.log(app.locals);
// all environments



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



app.get('/', routes.index);
app.get('/signup', routes.signup);
app.get('/features', routes.features);
app.get('/pricing', routes.pricing);
app.get('/theme', routes.theme);
app.get('/contact', routes.contact);
app.get('/about', routes.about);
app.get('/oops', routes.oops);


app.get('/', routes.index);
app.get('/product', routes.product);
app.get('/product/:id', routes.product_any);
app.get('/products', routes.product);
app.get('/products/:id', routes.product_any);
app.get('/collection-list', routes.collection_list);
app.get('/collections', routes.collection);
app.get('/collections/:id', routes.collection);
app.get('/page', routes.page);
app.get('/page/:id', routes.page);
app.get('/search', routes.search_page);
app.get('/cart', routes.cart);
app.get('/signup', routes.signup);
app.get('/login', routes.login);
app.get('/forgot_password', routes.forgot_password);
app.get('/reset_password/:id', routes.reset_password_email);
app.get('/reset_password', routes.reset_password);
app.get('/account_info', routes.account_info);
app.get('/orders', routes.orders);
app.get('/search', routes.search);
app.get('/account', routes.account);
app.get('/checkout', routes.checkout);
app.get('/confirm', routes.confirm_screen);
app.get('/thankyou', routes.thankyou);


app.post('/', routes.index);
app.post('/product', routes.product);
app.post('/product/:id', routes.product_any);
app.post('/products', routes.product);
app.post('/products/:id', routes.product_any);
app.post('/collection-list', routes.collection_list);
app.post('/collections', routes.collection);
app.post('/collections/:id', routes.collection);
app.post('/page', routes.page);
app.post('/page/:id', routes.page);
app.post('/search', routes.search_page);
app.post('/cart', routes.cart);
app.post('/signup', routes.signup);
app.post('/login', routes.login);
app.post('/forgot_password', routes.forgot_password);
app.post('/reset_password', routes.reset_password);
app.post('/reset_password/:id', routes.reset_password_email);
app.post('/account_info', routes.account_info);
app.post('/orders', routes.orders);
app.post('/search', routes.search);
app.post('/account', routes.account);
app.post('/checkout', routes.checkout);
app.post('/confirm', routes.confirm_screen);
app.post('/thankyou', routes.thankyou);







http.createServer(app).listen(app.get('port'), function(){
  
  //console.log('Express server listening on port ' + app.get('port'));
  
});

app.get('/:any', routes.notFound);


////////console.log(azure);
