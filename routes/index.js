
/*
 * GET home page.
 */
var express = require('express');
var request = require('request');
var app = express();
var renderApp = function(req, res){	
console.log(req.app.locals.storeName);
	request('http://ae-commerce.azure-mobile.net/api/fishrysdk?store_id='+req.app.locals.storeName, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		  console.log('http://ae-commerce.azure-mobile.net/api/fishrysdk?store_id='+req.app.locals.storeName);
		var dataBody = JSON.parse(body);
				app.locals.app_storeId = dataBody.storeID;
				app.locals.app_theme = dataBody.theme;
				app.locals.app_settings_general = dataBody.settings_general;
		var appSetings = app.locals.app_settings_general[0];
		if(appSetings.settings){
			appSetings.settings = JSON.parse(appSetings.settings);
				var data = {
				title: req.app.locals.storeName.toUpperCase() + ' | Home',
				StoreId: res.app.locals.store,
				BaseUrl:res.app.locals.ThemeFolderPathBase,
				storeId:app.locals.app_storeId,		
				theme:app.locals.app_theme,		
				settingsGeneral:appSetings,
				storeName:req.app.locals.storeName.toUpperCase(),
				meta: {
					fragment: "!",
					name: appSetings.settings.meta_title,
					description:appSetings.settings.meta_description
				}
			};
		}else{
			var data = {
				title: req.app.locals.storeName.toUpperCase() + ' | Home',
				StoreId: res.app.locals.store,
				BaseUrl:res.app.locals.ThemeFolderPathBase,
				storeId:app.locals.app_storeId,		
				theme:app.locals.app_theme,		
				settingsGeneral:appSetings,
				storeName:req.app.locals.storeName.toUpperCase(),
				meta: {
					fragment: "!",
					name: req.app.locals.storeName.toUpperCase(),
					description:req.app.locals.storeName.toUpperCase()
				}
			};
		}
		//console.log(appSetings);
		
		
		console.log(req.app.locals.storeName);
		/*var data = {
			title: 'Home',
			StoreId: res.app.locals.store,
			BaseUrl:res.app.locals.ThemeFolderPathBase,
			meta: {
				fragment: "!",
				keywords: "Fishry, Online, Store, Angular, Azure, Node.js, Express",
				description: "Fishry Online Store",
				image: "http://cdn.shopify.com/s/images/admin/no-image-large.gif?87fcfef5f03b1084632f0a98b53e2285f5c5c37e"
			}
		}*/
		res.app.locals.renderScriptsTags = function(script) {
					return  script;
		}
		res.render(res.app.locals.EjsFilePath+'index', data);
		
	  }else{
	  	res.send('No store found get one <a href="//fishry.com">click here</a>');
	  }
	})
}
exports.index = function(req, res){	
  renderApp(req,res);
};
exports.product = function(req, res){
  renderApp(req,res);
};
exports.product_any = function(req, res){
  renderApp(req,res);
};
exports.product_detail = function(req, res){
  renderApp(req,res);
};
exports.collection_list = function(req, res){
  renderApp(req,res);
};
exports.collection = function(req, res){
  renderApp(req,res);
};
exports.page = function(req, res){
  renderApp(req,res);
};
exports.search_page = function(req, res){
  renderApp(req,res);
};

exports.cart = function(req, res){
  renderApp(req,res);
};
exports.confirm = function(req, res){
  renderApp(req,res);
};

exports.login = function(req, res){
  renderApp(req,res);
};
exports.signup = function(req, res){
  renderApp(req,res);
};

exports.account = function(req, res){
  renderApp(req,res);
};
exports.checkout = function(req, res){
  renderApp(req,res);
};
exports.confirm_screen = function(req, res){
  renderApp(req,res);
};
exports.thankyou = function(req, res){
  renderApp(req,res);
};
exports.notFound = function(req, res){
  renderApp(req,res);
};






