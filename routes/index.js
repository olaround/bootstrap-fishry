
/*
 * GET home page.
 */
var express = require('express');
var request = require('request');
var app = express();
var handleError = function(req,res){
	res.render('pages/index');
}
var renderApp = function(req, res){
	////console.log(res.app.get('WEB_ADDRESS'));
	  var url = req.protocol + '://' + req.get('host') + req.originalUrl;
		  var BaseUrl = req.get('host').split('.');
		        	  app.locals.domainUrl = req.get('host');
					  if(BaseUrl[0] == 'fishry'){
						BaseUrl[0] = 'demo';
					  }
					  
					  if(req.get('host') == res.app.get('WEB_ADDRESS')+'com' || req.get('host') == res.app.get('WEB_ADDRESS')+'.com:3000' || req.get('host') == 'www.'+res.app.get('WEB_ADDRESS')+'.com' || req.get('host') == 'www.'+res.app.get('WEB_ADDRESS')+'.com:3000'){
						  ////////console.log('BDA FISHRY')
						app.locals.store = '12345';						
						app.locals.ThemeFolder = 'public/frontend/';
						app.locals.ThemeFolderPath =  'public/frontend/';
						app.locals.ThemeFolderPathBase =   'frontend/';
						app.locals.ThemeFolderPathBaseAdmin =  'public/frontend/';
						app.locals.EjsFilePath =  'home/views/';
					  }else {
						app.locals.store = '12345';
						app.locals.ThemeFolder = 'public/themes/'+BaseUrl[0]+'/';
						app.locals.ThemeFolderPath =  'public/themes/'+BaseUrl[0]+'/active/views/';
						app.locals.ThemeFolderPathBase =  '/themes/'+BaseUrl[0]+'/active/base/';	
						app.locals.ThemeFolderPathBaseAdmin =  '/themes/'+BaseUrl[0]+'/active/base/partials/';	
						app.locals.EjsFilePath = 'themes/'+BaseUrl[0]+'/active/views/';
						app.locals.storeName = BaseUrl[0];
						//////console.log('bda');
						
					  }
	
	
	
	
	
	
	
	
	////////console.log('*******');
	////////console.log(url);
	////////console.log(app.locals.EjsFilePath);
	////////console.log('*******');
	////////console.log(req.route.path);
	////////console.log(app.locals.store);
	var appUrl = app.locals.domainUrl.replace('http://','');
	 	appUrl = appUrl.replace('//','');
		////////console.log(appUrl+'-----------bda--------------')	;
	if(appUrl.indexOf(res.app.get('WEB_ADDRESS')+'.com') < 0){
		var requestUrlDomain = 'http://'+res.app.get('MOBILE_SERVICE_NAME')+'.azure-mobile.net/api/fishrysdk?domain='+appUrl;
		//////////console.log(requestUrlDomain);
		request(requestUrlDomain, function (error, response, body) {
	  				if (!error && response.statusCode == 200) {
						if(body){
							////////////console.log('bda');
							////////////console.log(body);
							var dataBody = JSON.parse(body);
							//console.log(dataBody);
							//console.log(dataBody);
							if(dataBody.hostName){ 							
									app.locals.store = '12345';
									app.locals.ThemeFolder = 'public/themes/'+dataBody.hostName+'/';
									app.locals.ThemeFolderPath =  'public/themes/'+dataBody.hostName+'/active/views/';
									app.locals.ThemeFolderPathBase =  '/themes/'+dataBody.hostName+'/active/base/';	
									app.locals.ThemeFolderPathBaseAdmin =  '/themes/'+dataBody.hostName+'/active/base/partials/';	
									app.locals.EjsFilePath = 'themes/'+dataBody.hostName+'/active/views/';
									app.locals.storeName = dataBody.hostName;
									loadAppEjs(req,res);
							}else{
								handleError(req,res);
							}
						}else{
							handleError(req,res);
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
  
   if(req.route.path == '/collections/:id' && req.route.params.id != 'all'){
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
		var requestUrl = 'http://'+res.app.get('MOBILE_SERVICE_NAME')+'.azure-mobile.net/api/fishrysdk?store_id='+app.locals.storeName+'&'+target+ '='+targetParam;
	}else{
		var requestUrl = 'http://'+res.app.get('MOBILE_SERVICE_NAME')+'.azure-mobile.net/api/fishrysdk?store_id='+app.locals.storeName;
	}
	//res.send('Testing phase please hold on');
	if(req.get('host') != res.app.get('WEB_ADDRESS')+'.com' && req.get('host') != res.app.get('WEB_ADDRESS')+'.com:3000' && req.get('host') != 'www.'+res.app.get('WEB_ADDRESS')+'.com' && req.get('host') != 'www.'+res.app.get('WEB_ADDRESS')+'.com:3000'){
	////////////console.log(requestUrl);
		request(requestUrl, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		
				var dataBody = JSON.parse(body);
				if(dataBody.theme && dataBody.theme[0] && dataBody.theme[0].theme_folder){
					var themeFolderPath = dataBody.theme[0].theme_folder.split('/');
					var themeFolder = themeFolderPath[3];
				}else{
					var themeFolder = 'active';
				}
				
				app.locals.app_storeId = dataBody.storeID;
				if(dataBody.settings_general){
				if(dataBody.theme[0]){
					app.locals.app_theme = dataBody.theme[0];
					if(app.locals.app_theme.theme_settings){
						app.locals.app_theme.theme_settings = JSON.parse(app.locals.app_theme.theme_settings);
					}
				}else{
					app.locals.app_theme = {};
				}
				if(dataBody.settings_general[0]){				
					app.locals.app_settings_general = dataBody.settings_general[0];
					app.locals.EjsFilePath = 'themes/'+dataBody.settings_general[0].hostName+'/'+themeFolder+'/views/';
					app.locals.ThemeFolder = 'public/themes/'+dataBody.settings_general[0].hostName+'/';
					app.locals.ThemeFolderPath =  'public/themes/'+dataBody.settings_general[0].hostName+'/'+themeFolder+'/views/';
					app.locals.ThemeFolderPathBase =  '/themes/'+dataBody.settings_general[0].hostName+'/'+themeFolder+'/base/';	
					app.locals.ThemeFolderPathBaseAdmin =  '/themes/'+dataBody.settings_general[0].hostName+'/'+themeFolder+'/base/partials/';	
					app.locals.EjsFilePath = 'themes/'+dataBody.settings_general[0].hostName+'/'+themeFolder+'/views/';
					app.locals.storeName = dataBody.settings_general[0].hostName;
				}else{
					app.locals.app_settings_general = {};
				}
				//////////console.log(app.locals.app_settings_general);				
				if(app.locals.app_settings_general.analyticsSnippet){
					app.locals.analyticScript = app.locals.app_settings_general.analyticsSnippet;
					app.locals.app_settings_general.analyticsSnippet = '';
				}else{
					app.locals.analyticScript = false;
				}
				
				if(app.locals.app_settings_general.settings){
					app.locals.generalSettingMeta = JSON.parse(app.locals.app_settings_general.settings);
				}else{
					app.locals.generalSettingMeta = {};
				}
				
				////////////console.log(app.locals.generalSettingMeta.meta_title);
				////////////console.log(app.locals.generalSettingMeta.meta_description);
				
				var imgOg = '';
				if(app.locals.app_theme.theme_settings){
					var themeSettings = app.locals.app_theme.theme_settings;
					if(themeSettings.logo_img){
						imgOg = themeSettings.logo_img;
					}
				}
				////////////console.log(app.locals.app_settings_general);
		var appSetings = app.locals.app_settings_general;
		////////console.log(dataBody);
		if(target && target == 'collection'){
			if(!dataBody.collection){
				res.redirect('http://'+req.get('host') + '/404');
				return true;
			}
			var SeoTitle = 	escape(dataBody.collection.collectionSeoTitle);		
			if(dataBody.collection.collectionImage){
				 imgOg = 'https://aecommerce.blob.core.windows.net/collection/'+dataBody.collection.collectionImage;
			}
			var data = {
						title: SeoTitle,
						StoreId: app.locals.store,
						BaseUrl:app.locals.ThemeFolderPathBase,
						storeId:app.locals.app_storeId,		
						theme:app.locals.app_theme,		
						settingsGeneral:app.locals.app_settings_general,
						analyticScript:app.locals.analyticScript,
						storeName:app.locals.storeName.toUpperCase(),						
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
						}
			}
		}else if(target && target == 'product'){
			if(!dataBody.product){
				res.redirect('http://'+req.get('host') + '/404');
				return true;
			}
			var SeoTitle = 	escape(dataBody.product.productSeoTitle);	
			if(dataBody.product.productImage){
				var imageUri = JSON.parse(dataBody.product.productImage)
				if(imageUri[0] && imageUri[0].Image){
					imgOg = imageUri[0].Image;
				}
			}
			var data = {
						title: SeoTitle,
						StoreId: app.locals.app_storeId,
						BaseUrl:app.locals.ThemeFolderPathBase,
						storeId:app.locals.app_storeId,		
						theme:app.locals.app_theme,			
						settingsGeneral:app.locals.app_settings_general,
						analyticScript:app.locals.analyticScript,
						storeName:app.locals.storeName.toUpperCase(),
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
													
						}
			}
		}else if(target && target == 'page'){
			if(!dataBody.page){
				////////console.log('---------Page---------');
				////////console.log(dataBody.page);
				res.redirect('http://'+req.get('host') + '/404');
				return true;
			}
			var SeoTitle = 	escape(dataBody.page.pageSeoTitle);	
			var data = {
						title: SeoTitle,
						StoreId: app.locals.app_storeId,
						BaseUrl:app.locals.ThemeFolderPathBase,
						storeId:app.locals.app_storeId,		
						theme:app.locals.app_theme,			
						settingsGeneral:app.locals.app_settings_general,
						analyticScript:app.locals.analyticScript,
						storeName:app.locals.storeName.toUpperCase(),
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
						}
			}		
		}else{
				
				if(appSetings.settings){
					appSetings.settings = JSON.parse(appSetings.settings);					
					if(req.route.path == '/cart'){
						var SeoTitle = 	escape('Cart') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else if(req.route.path == '/login'){
						var SeoTitle = 	escape('Login') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else if(req.route.path == '/signup'){
						var SeoTitle = 	escape('Signup') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else if(req.route.path == '/confirm'){
						var SeoTitle = 	escape('Confirm') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else if(req.route.path == '/thankyou'){
						var SeoTitle = 	escape('Thankyou') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else if(req.route.path == '/forgot_password'){
						var SeoTitle = 	escape('Forgot Password') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else if(req.route.path == '/reset_password'){
						var SeoTitle = 	escape('Reset Password') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else{
						var SeoTitle = 	escape(appSetings.settings.meta_title);
					}
						var data = {
						title: SeoTitle,
						StoreId: app.locals.app_storeId,
						BaseUrl:app.locals.ThemeFolderPathBase,
						storeId:app.locals.app_storeId,		
						theme:app.locals.app_theme,		
						settingsGeneral:app.locals.app_settings_general,
						analyticScript:app.locals.analyticScript,
						storeName:app.locals.storeName.toUpperCase(),
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
						}
					};
				}else{
					if(req.route.path == '/cart'){
						var SeoTitle = 	escape('Cart') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else if(req.route.path == '/login'){
						var SeoTitle = 	escape('Login') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else if(req.route.path == '/signup'){
						var SeoTitle = 	escape('Signup') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else if(req.route.path == '/confirm'){
						var SeoTitle = 	escape('Confirm') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else if(req.route.path == '/thankyou'){
						var SeoTitle = 	escape('Thank You') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else if(req.route.path == '/forgot_password'){
						var SeoTitle = 	escape('Forgot Password') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else if(req.route.path == '/reset_password'){
						var SeoTitle = 	escape('Reset Password') + ' - '+escape(app.locals.generalSettingMeta.meta_title);
					}else{
						var SeoTitle = 	escape(appSetings.settings.meta_title);
					}
					var data = {
						title: SeoTitle,
						StoreId: app.locals.app_storeId,
						BaseUrl:app.locals.ThemeFolderPathBase,
						storeId:app.locals.app_storeId,		
						theme:app.locals.app_theme,		
						settingsGeneral:app.locals.app_settings_general,
						analyticScript:app.locals.analyticScript,
						storeName:app.locals.storeName.toUpperCase(),
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
						}
					};
				}
		}
			req.app.locals.requireServerVars = function(){
				var favicon = '';
				if(app.locals.app_theme.theme_settings && app.locals.app_theme.theme_settings != ''){			
					var ThemeSettingsObject = app.locals.app_theme.theme_settings;
					if(ThemeSettingsObject.favicon){
						favicon = "<link rel='shortcut icon' href='"+ThemeSettingsObject.favicon+"'>";
					}
				}
				if(app.locals.analyticScript != 'null' && app.locals.analyticScript){
				return  "<script>"+
						"var StoreID = '"+app.locals.app_storeId+"';"+
						"var BaseUrl = '"+app.locals.ThemeFolderPathBase+"';"+
						"var storeName = '"+escape(app.locals.app_settings_general.name)+"';"+
						"var storeNameMeta = '"+escape(app.locals.generalSettingMeta.meta_title)+"';"+
						"var Theme = "+JSON.stringify(app.locals.app_theme)+";"+
						"var SettingGeneral  = "+JSON.stringify(app.locals.app_settings_general)+";"+
						"var seoTitle  = '"+SeoTitle+"';"+
						"var ServiceName  = '"+res.app.get('MOBILE_SERVICE_NAME')+"';"+
						"var ServiceKey  = '"+res.app.get('MOBILE_SERVICE_KEY')+"';"+
						"var WebAddress  = '"+res.app.get('WEB_ADDRESS')+"';"+
					  	"</script> "+
			  		 	app.locals.analyticScript+favicon;
				}else{
					return  "<script>"+
						"var StoreID = '"+app.locals.app_storeId+"';"+
						"var BaseUrl = '"+app.locals.ThemeFolderPathBase+"';"+
						"var storeName = '"+escape(app.locals.app_settings_general.name)+"';"+
						"var storeNameMeta = '"+escape(app.locals.generalSettingMeta.meta_title)+"';"+
						"var Theme = "+JSON.stringify(app.locals.app_theme)+";"+
						"var SettingGeneral  = "+JSON.stringify(app.locals.app_settings_general)+";"+
						"var seoTitle  = '"+SeoTitle+"';"+
						"var ServiceName  = '"+res.app.get('MOBILE_SERVICE_NAME')+"';"+
						"var ServiceKey  = '"+res.app.get('MOBILE_SERVICE_KEY')+"';"+
						"var WebAddress  = '"+res.app.get('WEB_ADDRESS')+"';"+
					  	"</script>"+favicon;
				}
			  
			}
			////console.log(app.locals.EjsFilePath);
			data.ServiceName = res.app.get('MOBILE_SERVICE_NAME');
			data.ServiceKey = res.app.get('MOBILE_SERVICE_KEY');
			data.WebAddress = res.app.get('WEB_ADDRESS');
			res.render(app.locals.EjsFilePath+'index', data);
	  	}else{
	  		handleError(req,res);
	  	}
	  }else{
	  	handleError(req,res);
	  }
	})
	}else{
		var imgOg = 'http://'+res.app.get('WEB_ADDRESS')+'.com/frontend/img/theme/og-fishry.png';
		if(req.route.path == '/'){	
				var data = {
						title: 'Fishry Pakistan - Ecommerce Software, Online Store Builder.',
						BaseUrl:app.locals.ThemeFolderPathBase,
						StoreId: app.locals.app_storeId,
						meta: {
							fragment: "!",
							name: 'description',
							description:'Fishry is a powerful hosted ecommerce website solution that allows you to setup an online store in minutes and sell online.',
							author: 'fishry',
							viewport: "width=device-width,initial-scale=1,maximum-scale=1.0",	
						},
						fbOg: {
							'og:image' : imgOg,
							'og:title' : 'Fishry Pakistan - Ecommerce Software, Online Store Builder.',
							'og:site_name' : 'Fishry',
						},
						twitterOg: {
							'twitter:card' : 'summary',
							'twitter:title' : 'Fishry',
							'twitter:description' : 'Fishry is a powerful hosted ecommerce website solution that allows you to setup an online store in minutes and sell online.',
							'og:image' : imgOg,
							'twitter:site' : '@bramerz'							
						}
			
				};
		
		}else if(req.route.path == '/signup'){
			var data = {
						title: 'Fishry Pakistan - Ecommerce Software, Online Store Builder.',
						BaseUrl:app.locals.ThemeFolderPathBase,
						StoreId: app.locals.app_storeId,
						meta: {
							fragment: "!",
							name: 'description',
							description:'Fishry is a powerful hosted ecommerce website solution that allows you to setup an online store in minutes and sell online.',
							author: 'fishry',
							viewport: "width=device-width,initial-scale=1,maximum-scale=1.0",
						},
						fbOg: {
							'og:image' : imgOg,
							'og:title' : 'Fishry Pakistan - Ecommerce Software, Online Store Builder.',
							'og:site_name' : 'Fishry',
						},
						twitterOg: {
							'twitter:card' : 'summary',
							'twitter:title' : 'Fishry',
							'twitter:description' : 'Fishry is a powerful hosted ecommerce website solution that allows you to setup an online store in minutes and sell online.',
							'og:image' : imgOg,
							'twitter:site' : '@bramerz'							
						}
			
				};
		}else if(req.route.path == '/features'){
				var data = {
							title: 'Fishry - Features',
							BaseUrl:app.locals.ThemeFolderPathBase,
							StoreId: app.locals.app_storeId,
							meta: {
								fragment: "!",
								name: 'description',
								description:'Fully professional themes, Responsive powered by a fully-featured CMS for shopping cart with Unlimited Cloud Hosting and a Support – 24/7.',
								author: 'fishry',
								viewport: "width=device-width,initial-scale=1,maximum-scale=1.0"
							},
							fbOg: {
								'og:image' : imgOg,
								'og:title' : 'Fishry Pakistan - Ecommerce Software, Online Store Builder.',
								'og:site_name' : 'Fishry',
								},
							twitterOg: {
								'twitter:card' : 'summary',
								'twitter:title' : 'Fishry',
								'twitter:description' : 'Fully professional themes, Responsive powered by a fully-featured CMS for shopping cart with Unlimited Cloud Hosting and a Support – 24/7.',
								'og:image' : imgOg,
								'twitter:site' : '@bramerz'							
							}
					};
		}else if(req.route.path == '/pricing'){
				var data = {
							title: 'Fishry Pakistan - Ecommerce Software, Online Store Builder.',
							BaseUrl:app.locals.ThemeFolderPathBase,
							StoreId: app.locals.app_storeId,
							meta: {
								fragment: "!",
								name: 'description',
								description:'Fishry is a powerful hosted ecommerce website solution that allows you to setup an online store in minutes and sell online.',
								author: 'fishry',
								viewport: "width=device-width,initial-scale=1,maximum-scale=1.0"
							},
							fbOg: {
								'og:image' : imgOg,
								'og:title' : 'Fishry Pakistan - Ecommerce Software, Online Store Builder.',
								'og:site_name' : 'Fishry',
								},
							twitterOg: {
								'twitter:card' : 'summary',
								'twitter:title' : 'Fishry',
								'twitter:description' : 'Fishry is a powerful hosted ecommerce website solution that allows you to setup an online store in minutes and sell online.',
								'og:image' : imgOg,
								'twitter:site' : '@bramerz'							
							}
					};
		}else if(req.route.path == '/about'){
				var data = {
							title: 'Fishry Pakistan - Ecommerce Software, Online Store Builder.',
							BaseUrl:app.locals.ThemeFolderPathBase,
							StoreId: app.locals.app_storeId,
							meta: {
								fragment: "!",
								name: 'description',
								description:'Fishry is a powerful hosted ecommerce website solution that allows you to setup an online store in minutes and sell online.',
								author: 'fishry',
								viewport: "width=device-width,initial-scale=1,maximum-scale=1.0",
							},
							fbOg: {
								'og:image' : imgOg,
								'og:title' : 'Fishry Pakistan - Ecommerce Software, Online Store Builder.',
								'og:site_name' : 'Fishry',
							},							
						twitterOg: {
								'twitter:card' : 'summary',
								'twitter:title' : 'Fishry',
								'twitter:description' : 'Fishry is a powerful hosted ecommerce website solution that allows you to setup an online store in minutes and sell online.',
								'og:image' : imgOg,
								'twitter:site' : '@bramerz'							
							}
				
					};
			
			
		}else if(req.route.path == '/oops'){
				var data = {
							title: 'Fishry Pakistan - Ecommerce Software, Online Store Builder.',
							BaseUrl:app.locals.ThemeFolderPathBase,
							StoreId: app.locals.app_storeId,
							meta: {
								fragment: "!",
								name: 'description',
								description:'Fishry is a powerful hosted ecommerce website solution that allows you to setup an online store in minutes and sell online.',
								author: 'fishry',
								viewport: "width=device-width,initial-scale=1,maximum-scale=1.0",
							},
							fbOg: {
								'og:image' : imgOg,
								'og:title' : 'Fishry Pakistan - Ecommerce Software, Online Store Builder.',
								'og:site_name' : 'Fishry',
							},							
						twitterOg: {
								'twitter:card' : 'summary',
								'twitter:title' : 'Fishry',
								'twitter:description' : 'Fishry is a powerful hosted ecommerce website solution that allows you to setup an online store in minutes and sell online.',
								'og:image' : imgOg,
								'twitter:site' : '@bramerz'							
							}
				
					};
			
			
		}else if(req.route.path == '/contact'){
				var data = {
							title: 'Fishry Pakistan - Contact Us',
							BaseUrl:app.locals.ThemeFolderPathBase,
							StoreId: app.locals.app_storeId,
							meta: {
								fragment: "!",
								name: 'description',
								description:'Fishry is a powerful hosted ecommerce website solution that allows you to setup an online store in minutes and sell online.',
								author: 'fishry',
								viewport: "width=device-width,initial-scale=1,maximum-scale=1.0"
							},
							fbOg: {
								'og:image' : imgOg,
								'og:title' : 'Fishry Pakistan - Ecommerce Software, Online Store Builder.',
								'og:site_name' : 'Fishry',
						},
							twitterOg: {
								'twitter:card' : 'summary',
								'twitter:title' : 'Fishry',
								'twitter:description' : 'Fishry is a powerful hosted ecommerce website solution that allows you to setup an online store in minutes and sell online.',
								'og:image' : imgOg,
								'twitter:site' : '@bramerz'							
							}
				
					};
			
		}else{
		var data = {
						title: 'Fishry Home Page',
						StoreId: app.locals.app_storeId,
						BaseUrl:app.locals.ThemeFolderPathBase,
						storeId:app.locals.app_storeId
					};
			}
			data.ServiceName = res.app.get('MOBILE_SERVICE_NAME');
			data.ServiceKey = res.app.get('MOBILE_SERVICE_KEY');
			data.WebAddress = res.app.get('WEB_ADDRESS');
		
		 res.render(app.locals.EjsFilePath+'index', data);
	}
}


/**********Fishry Home***********/
exports.features = function(req, res){
	renderApp(req,res);
};
exports.pricing = function(req, res){
  renderApp(req,res);
};
exports.theme = function(req, res){
  renderApp(req,res);
};
exports.contact = function(req, res){
  renderApp(req,res);
};
exports.about = function(req, res){
  renderApp(req,res);
};
exports.oops = function(req, res){
  renderApp(req,res);
};






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
exports.reset_password_email = function(req, res){
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



