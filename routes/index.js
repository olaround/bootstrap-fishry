
/*
 * GET home page.
 */
var express = require('express');
var request = require('request');
var app = express();
var renderApp = function(req, res){
	var appUrl = res.app.locals.domainUrl.replace('http://','');
	 	appUrl = appUrl.replace('/','');	
	if(appUrl.indexOf('fishry.com') < 0){
		var requestUrlDomain = 'http://ae-commerce.azure-mobile.net/api/fishrysdk?domain='+appUrl;
		//console.log(requestUrlDomain);
		request(requestUrlDomain, function (error, response, body) {
	  				if (!error && response.statusCode == 200) {
						if(body){
							////console.log('bda');
							////console.log(body);
							var dataBody = JSON.parse(body);
							if(dataBody.hostName){ 							
									res.app.locals.store = '12345';
									res.app.locals.ThemeFolder = 'public/themes/'+dataBody.hostName+'/';
									res.app.locals.ThemeFolderPath =  'public/themes/'+dataBody.hostName+'/active/views/';
									res.app.locals.ThemeFolderPathBase =  '/themes/'+dataBody.hostName+'/active/base/';	
									res.app.locals.ThemeFolderPathBaseAdmin =  '/themes/'+dataBody.hostName+'/active/base/partials/';	
									res.app.locals.EjsFilePath = 'themes/'+dataBody.hostName+'/active/views/';
									res.app.locals.storeName = dataBody.hostName;
									loadAppEjs(req,res);
							}else{
								res.send('No store found get one <a href="//fishry.com">click here</a>');
							}
						}else{
							res.send('No store found get one <a href="//fishry.com">click here</a>');
						}
					}
				});
	}else{
		loadAppEjs(req,res);
	}
	
}
var loadAppEjs = function(req,res){
	var urlMain = req.protocol + '://' + req.get('host') + req.originalUrl;
	var target =  false;
	if(req.route.path == '/collections/:id'){
		target = 'collection'
		var targetParam = req.route.params.id;	
	}
	if(req.route.path == '/product/:id'){
		target = 'product'
		var targetParam = req.route.params.id;	
	}
	if(req.route.path == '/products/:id'){
		target = 'product'
		var targetParam = req.route.params.id;	
	}
	if(req.route.path == '/page/:id'){
		target = 'page'
		var targetParam = req.route.params.id;	
	}
	if(target){
		var requestUrl = 'http://ae-commerce.azure-mobile.net/api/fishrysdk?store_id='+req.app.locals.storeName+'&'+target+ '='+targetParam;
	}else{
		var requestUrl = 'http://ae-commerce.azure-mobile.net/api/fishrysdk?store_id='+req.app.locals.storeName;
	}
	//res.send('Testing phase please hold on');
	if(req.app.locals.storeName){
	////console.log(requestUrl);
		request(requestUrl, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		 // //console.log('http://ae-commerce.azure-mobile.net/api/fishrysdk?store_id='+req.app.locals.storeName);
				var dataBody = JSON.parse(body);
				app.locals.app_storeId = dataBody.storeID;
				app.locals.app_theme = dataBody.theme[0];				
				app.locals.app_settings_general = dataBody.settings_general[0];
				app.locals.analyticScript = app.locals.app_settings_general.analyticsSnippet;
				app.locals.generalSettingMeta = JSON.parse(app.locals.app_settings_general.settings);
				////console.log(app.locals.generalSettingMeta.meta_title);
				////console.log(app.locals.generalSettingMeta.meta_description);
				app.locals.app_settings_general.analyticsSnippet = '';
				var imgOg = '';
				if(app.locals.app_theme.theme_settings){
					var themeSettings = JSON.parse(app.locals.app_theme.theme_settings);
					if(themeSettings.logo_img){
						imgOg = themeSettings.logo_img;
					}
				}
				////console.log(app.locals.app_settings_general);
		var appSetings = app.locals.app_settings_general;
		if(target && target == 'collection'){			
			if(dataBody.collection.collectionImage){
				 imgOg = 'https://aecommerce.blob.core.windows.net/collection/'+dataBody.collection.collectionImage;
			}
			var data = {
						title: dataBody.collection.collectionSeoTitle + ' - '+app.locals.generalSettingMeta.meta_title,
						StoreId: res.app.locals.store,
						BaseUrl:res.app.locals.ThemeFolderPathBase,
						storeId:app.locals.app_storeId,		
						theme:JSON.stringify(app.locals.app_theme),		
						settingsGeneral:JSON.stringify(app.locals.app_settings_general),
						analyticScript:app.locals.analyticScript,
						storeName:req.app.locals.storeName.toUpperCase(),
						meta: {
							fragment: "!",
							name: dataBody.collection.collectionSeoTitle,
							description:dataBody.collection.collectionSeoDescription,
							viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
							keywords:dataBody.collection.collectionTags
						},
						og: {
							'og:title' : dataBody.collection.collectionSeoTitle,
							'og:image' : imgOg,
							'og:description' : dataBody.collection.collectionSeoDescription,
							'og:url' : urlMain,
							'og:type' : 'Shopping',							
						}
			}
		}else if(target && target == 'product'){			
			if(dataBody.product.productImage){
				var imageUri = JSON.parse(dataBody.product.productImage)
				if(imageUri[0].Image){
					imgOg = imageUri[0].Image;
				}
			}
			var data = {
						title: dataBody.product.productSeoTitle + ' - '+app.locals.generalSettingMeta.meta_title,
						StoreId: app.locals.app_storeId,
						BaseUrl:res.app.locals.ThemeFolderPathBase,
						storeId:app.locals.app_storeId,		
						theme:JSON.stringify(app.locals.app_theme),			
						settingsGeneral:JSON.stringify(app.locals.app_settings_general),
						analyticScript:app.locals.analyticScript,
						storeName:req.app.locals.storeName.toUpperCase(),
						meta: {
							fragment: "!",
							name: dataBody.product.productSeoTitle,
							description:dataBody.product.productSeoMeta,
							viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
							keywords:dataBody.product.productTags
						},
						og: {
							'og:title' : dataBody.product.productSeoTitle,
							'og:image' : imgOg,
							'og:description' : dataBody.product.productSeoMeta,
							'og:url' : urlMain,
							'og:type' : 'Shopping',
													
						}
			}
		}else if(target && target == 'page'){
			var data = {
						title: dataBody.page.pageSeoTitle + ' - '+app.locals.generalSettingMeta.meta_title,
						StoreId: app.locals.app_storeId,
						BaseUrl:res.app.locals.ThemeFolderPathBase,
						storeId:app.locals.app_storeId,		
						theme:JSON.stringify(app.locals.app_theme),			
						settingsGeneral:JSON.stringify(app.locals.app_settings_general),
						analyticScript:app.locals.analyticScript,
						storeName:req.app.locals.storeName.toUpperCase(),
						meta: {
							fragment: "!",
							name: dataBody.page.pageSeoTitle,
							description:dataBody.page.pageSeoDescription,
							viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
						},
						og: {
							'og:title' : dataBody.page.pageSeoTitle,
							'og:image' : imgOg,
							'og:description' : dataBody.page.pageSeoDescription,
							'og:url' : urlMain,
							'og:type' : 'Shopping',							
						}
			}
		}else{
				if(appSetings.settings){
					appSetings.settings = JSON.parse(appSetings.settings);
						var data = {
						title: appSetings.settings.meta_title,
						StoreId: app.locals.app_storeId,
						BaseUrl:res.app.locals.ThemeFolderPathBase,
						storeId:app.locals.app_storeId,		
						theme:JSON.stringify(app.locals.app_theme),		
						settingsGeneral:JSON.stringify(app.locals.app_settings_general),
						analyticScript:app.locals.analyticScript,
						storeName:req.app.locals.storeName.toUpperCase(),
						meta: {
							fragment: "!",
							name: appSetings.settings.meta_title,
							description:appSetings.settings.meta_description,
							viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
						},
						og: {
							'og:title' : appSetings.settings.meta_title,
							'og:image' : imgOg,
							'og:description' : appSetings.settings.meta_description,
							'og:url' : urlMain,
							'og:type' : 'Shopping',							
						}
					};
				}else{
					var data = {
						title: app.locals.generalSettingMeta.meta_title,
						StoreId: app.locals.app_storeId,
						BaseUrl:res.app.locals.ThemeFolderPathBase,
						storeId:app.locals.app_storeId,		
						theme:JSON.stringify(app.locals.app_theme),		
						settingsGeneral:JSON.stringify(app.locals.app_settings_general),
						analyticScript:app.locals.analyticScript,
						storeName:req.app.locals.storeName.toUpperCase(),
						meta: {
							fragment: "!",
							name: app.locals.generalSettingMeta.meta_title,
							description:app.locals.generalSettingMeta.meta_description,
							viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
						},
						og: {
							'og:title' : app.locals.generalSettingMeta.meta_title,
							'og:image' : imgOg,
							'og:description' : app.locals.generalSettingMeta.meta_description,
							'og:url' : urlMain,
							'og:type' : 'Shopping',							
						}
					};
				}
		}
			req.app.locals.requireServerVars = function(){
				return  "<script>"+
						"var StoreID = '"+app.locals.app_storeId+"';"+
						"var BaseUrl = '"+res.app.locals.ThemeFolderPathBase+"';"+
						"var storeName = '"+req.app.locals.storeName+"';"+
						"var storeNameMeta = '"+app.locals.generalSettingMeta.meta_title+"';"+
						"var Theme = "+JSON.stringify(app.locals.app_theme)+";"+
						"var SettingGeneral  = "+JSON.stringify(app.locals.app_settings_general)+";"+
					  	"</script> "+
			  		 	app.locals.analyticScript;
			  
			}
			res.render(res.app.locals.EjsFilePath+'index', data);
		
	  }else{
	  	res.send('No store found get one <a href="//fishry.com">click here</a>');
	  }
	})
	}else{
		var data = {
						title: 'Fishry Home Page',
						StoreId: app.locals.app_storeId,
						BaseUrl:res.app.locals.ThemeFolderPathBase,
						storeId:app.locals.app_storeId
					};
		res.render(res.app.locals.EjsFilePath+'index', data);
	}
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
exports.search = function(req, res){
  renderApp(req,res);
};

exports.confirm = function(req, res){
  renderApp(req,res);
};

exports.login = function(req, res){
  renderApp(req,res);
};
exports.forgot_password = function(req, res){
  renderApp(req,res);
};
exports.reset_password = function(req, res){
  renderApp(req,res);
};
exports.account_info = function(req, res){
  renderApp(req,res);
};
exports.orders = function(req, res){
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
