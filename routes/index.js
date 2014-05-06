var express = require('express');
var request = require('request');
var app = express();
var renderApp = function(req, res){	
	request('http://ae-commerce.azure-mobile.net/api/fishrysdk?store_id='+req.app.locals.storeName, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		  console.log('http://ae-commerce.azure-mobile.net/api/fishrysdk?store_id='+req.app.locals.storeName);
		var dataBody = JSON.parse(body);
				app.locals.app_storeId = dataBody.storeID;
				app.locals.app_theme = dataBody.theme;
				app.locals.app_settings_general = dataBody.settings_general;
		var data = {
			title: 'Home',
			StoreId: res.app.locals.store,
			BaseUrl:res.app.locals.ThemeFolderPathBase,
			storeId:app.locals.app_storeId,		
			theme:app.locals.app_theme,		
			settings:app.locals.app_settings_general,		
			meta: {
				fragment: "!",
				keywords: "Fishry, Online, Store, Angular, Azure, Node.js, Express",
				description: "Fishry Online Store",
				image: "http://cdn.shopify.com/s/images/admin/no-image-large.gif?87fcfef5f03b1084632f0a98b53e2285f5c5c37e"
			}
		};
		res.render(res.app.locals.EjsFilePath+'index', data);
		
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





