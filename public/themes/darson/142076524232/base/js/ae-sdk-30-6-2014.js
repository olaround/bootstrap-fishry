function AECtrl ($rootScope,$location,AzureMobileClient,$routeParams,$cookies,$http,$compile,$timeout) {
	//alert(localStorage.getItem('myFirstKey'));
	////console.log($routeParams);
	$rootScope.$location = $location;	
	$rootScope.Cart = {};
	
	$rootScope.orderId = 'OrderIDRender';
	$rootScope.User = {};
	$rootScope.userData = {};
	$rootScope.User.info = {};
	$rootScope.produtCount = {};
	$rootScope.isCollapsed = true;
	$rootScope.issetPasswordResetFlag = false;
	$rootScope.ResetPasswordEmail = false;
	$rootScope.ResetPasswordMessage = false;
	$rootScope.OrderInfo = true;
	$rootScope.SettingGeneral = '';
	$rootScope.paymentInfo = '';
	$rootScope.SettingShippingCountry = {};
	$rootScope.SettingShipping = {};
	$rootScope.BaseUrl = BaseUrl;
	$rootScope.storeName = unescape(storeName);
	$rootScope.StartLogin = false;
	$rootScope.StartSignup = false;
	$rootScope.StartSubmitOrder = false;
	$rootScope.StartForgotPassword = false;
	$rootScope.invalidEmail = false;
	$rootScope.ForgotEmail = false;
	$rootScope.LoadPositions = 10;
	$rootScope.Incremetor = 10;
	$rootScope.dt = new Date();
	$rootScope.CartData = false;
	$rootScope.PaymentMethod = '';
	$rootScope.ExtraOptions = '';
	
	$rootScope.submitedOrder = [];
	$rootScope.Customer = {};
	$rootScope.ErrorLogin = false;
	$rootScope.GuestEmail = 'guest@fishry.com';
	$rootScope.GuestFirstName = 'Guest';
	$rootScope.GuestLastName = 'User';
	$rootScope.varientsTypes = ['Title','Size','Color','Material','Style','custom'];
	$rootScope.varientSelected = {};
    $rootScope.userVraients = {};
	$rootScope.varientSizeValue = {};
	var todayDate = moment().format();
//Table Names	
	$rootScope.CollectionTable = 'collection';
	$rootScope.ProductTable = 'product';
	$rootScope.ProductTypeTable = 'product_type';
	$rootScope.ProductVendorTable = 'product_vendor';
	$rootScope.CustomerTable = 'customer';
	$rootScope.OrderTable = 'order';
	$rootScope.PageTable = 'page';
	$rootScope.NavigationTable = 'link_list';
	$rootScope.PaymentGatewaysTable = 'settings_payment';
	$rootScope.ThemeTable = 'theme';
	$rootScope.SettingsGeneralTable = 'settings_general';
	$rootScope.SettingsShippingCountryTable = 'settings_shipping_country';
	$rootScope.SettingsShippingTable = 'settings_shipping';
	$rootScope.SettingsNotificationTable = 'settings_notification';
	$rootScope.SettingsNotificationOrderTable = 'settings_notification_order';

//Main Scopes Names	
	$rootScope.ThemeSettings = {};
	$rootScope.ListCollection = {};
	$rootScope.ListProduct = {};
	$rootScope.ListOrders = {};
	$rootScope.ListProductType = {};
	$rootScope.ListProductVendor = {};
	$rootScope.ListPage = {};
	$rootScope.ListNavigation = {};
	$rootScope.ListPaymentGateways = {};
	$rootScope.ListPaymentMethod = {};
	$rootScope.ListSettingsNotification = {};
	$rootScope.ListSettingsNotificationOrder = {};
	
	
//Get Theme
$rootScope.loadPositionSetter = function(){
	$('#loadingbar').show();
	$rootScope.LoadPositions = $rootScope.Incremetor  + $rootScope.LoadPositions;
	$('#loadingbar').width($rootScope.LoadPositions+'%');
	//console.log($rootScope.LoadPositions);
	if($rootScope.LoadPositions >= 90){		
			$rootScope.LoadPositions = 100;
			$('#loadingbar').width($rootScope.LoadPositions+'%');
			$('.container').fadeIn(function(){
				$('#loadingbar').hide();
				$('#loadingbar').width(0+'%');
			});
		
	}
}
if(Theme){
	$rootScope.ThemeSettings = Theme;
	console.log('-----------------bda---------------');
	console.log(Theme);
	console.log($rootScope.ThemeSettings);
	if($rootScope.ThemeSettings.theme_settings){
		if(typeof($rootScope.ThemeSettings.theme_settings) != 'object'){
			$rootScope.ThemeSettings.theme_settings = JSON.parse($rootScope.ThemeSettings.theme_settings);
		}
	}
}

$rootScope.GetTheme = function(param){
		AzureMobileClient.getFilterData($rootScope.ThemeTable,{theme_main:'1'}).then(
			function(data) {
				if(data.length > 0){
					$rootScope.ThemeSettings = data[0];
					$rootScope.ThemeSettings.theme_settings = JSON.parse($rootScope.ThemeSettings.theme_settings);
				}
				$rootScope.loadPositionSetter();
				//$rootScope.GetCollection();
				 $rootScope.$apply();
		});
	
};

// get notification settings order
$rootScope.subscriptionEmails = [];
$rootScope.GetSettingNotificationOrder = function(param){
		AzureMobileClient.getFilterData($rootScope.SettingsNotificationOrderTable,{}).then(
			function(data) {
				$rootScope.ListSettingsNotificationOrder = data;
					$.each($rootScope.ListSettingsNotificationOrder, function(index, item){
						$rootScope.subscriptionEmails.push(item.subscriptionEmail);
					});
						//console.log($rootScope.subscriptionEmails);
						$rootScope.loadPositionSetter();
						$rootScope.$apply();
		});
	
};

// get notification settings
$rootScope.GetSettingNotification = function(param){
		AzureMobileClient.getFilterData($rootScope.SettingsNotificationTable,{}).then(
			function(data) {
				if(data.length > 0){
					$rootScope.ListSettingsNotification = data[0];
					$rootScope.newOrderTitle =  $rootScope.ListSettingsNotification.NewOrderTitle;
					$rootScope.orderTitle =  $rootScope.ListSettingsNotification.OrderTitle;
					if($rootScope.ListSettingsNotification.OrderPlainText == true){
						$rootScope.orderConfirmationTemplate = $rootScope.ListSettingsNotification.OrderText;
					}else if($rootScope.ListSettingsNotification.OrderPlainText == false){
						$rootScope.orderConfirmationTemplate = $rootScope.ListSettingsNotification.OrderHTML;
					}
					
					if($rootScope.ListSettingsNotification.NewOrderPlainText == true){
						$rootScope.newOrderTemplate = $rootScope.ListSettingsNotification.NewOrderText;
					}else if($rootScope.ListSettingsNotification.NewOrderPlainText == false){
						$rootScope.newOrderTemplate = $rootScope.ListSettingsNotification.NewOrderHTML;
					}
				}
				$rootScope.loadPositionSetter();
				$rootScope.$apply(function(){
					$rootScope.applyDivOrderConfirmationTemplate();
				});
		});
	
};

$rootScope.GetSettingShippingCountry = function(param){
		AzureMobileClient.getFilterData($rootScope.SettingsShippingCountryTable,{}).then(
			function(data) {
				if(data.length > 0){
					$rootScope.SettingsShippingCountry = data;
					$rootScope.Customer.ShippingCountry = data[0].CountryName;
					//console.log($rootScope.SettingsShippingCountry);
					AzureMobileClient.getFilterData($rootScope.SettingsShippingTable,{}).then(
					function(data) {
						if(data.length > 0){
							//console.log('Shipping');
							//console.log(data);
							$rootScope.SettingShipping = data;
							
							$.each($rootScope.SettingShipping,function(index,item){
								var countryName = false;
									$.each($rootScope.SettingsShippingCountry,function(ind,itm){
											if(item.ShippingCountryID == itm.id){
												countryName = itm.CountryName;
											}
									});
									if(countryName){
										$rootScope.SettingShipping[index].countryName = countryName;
									}else{
										delete $rootScope.SettingShipping[index];
									}
							});
							//console.log('Strat');
							//console.log($rootScope.SettingShipping);
							//console.log($rootScope.SettingsShippingCountry);
						 }
						 $rootScope.loadPositionSetter();
						 
						 $rootScope.$apply();
					});
					
				}
				//$rootScope.GetCollection();
		});
	
};
if(SettingGeneral){
	$rootScope.SettingGeneral = SettingGeneral;
	//console.log($rootScope.SettingGeneral);
	if(typeof($rootScope.SettingGeneral.settings) != 'object'){
		$rootScope.SettingGeneral.settings = JSON.parse($rootScope.SettingGeneral.settings);
	}
}
$rootScope.GetSettingGeneral = function(param){
		AzureMobileClient.getFilterData($rootScope.SettingsGeneralTable,{}).then(
			function(data) {
				if(data.length > 0){
					$rootScope.SettingGeneral = data[0];
					$rootScope.SettingGeneral.settings = JSON.parse($rootScope.SettingGeneral.settings);
				}
				$rootScope.loadPositionSetter();
				 $rootScope.$apply();
		});
	
};

$rootScope.CreatCartHTML = function() {
		$rootScope.HTML = '<table class="table" border="1" style="width:100%; border:1px solid #dddddd;" cellspacing="0" cellpadding="0">';
		$rootScope.HTML += '<thead>';
		$rootScope.HTML += '<tr>';
		$rootScope.HTML += '<th class="col-md-4" style="width:10%;border:1px solid #dddddd;padding: 8px;">#</th> ';
		$rootScope.HTML += '<th class="col-md-4" style="width:30%;border:1px solid #dddddd;padding: 8px;">Product Name</th>';
		$rootScope.HTML += '<th class="col-md-4" style="width:10%;border:1px solid #dddddd;padding: 8px;">Price</th>';
		$rootScope.HTML += '<th class="col-md-4" style="width:20%;border:1px solid #dddddd;padding: 8px;">Quantity</th>';
		$rootScope.HTML += '<th class="col-md-4" style="width:30%;border:1px solid #dddddd;padding: 8px;">Total Price</th>';
		$rootScope.HTML += '</tr>';
		$rootScope.HTML += '</thead>';
		$rootScope.HTML += '<tbody>';
		$.each($rootScope.Cart,function(index,item){
		$rootScope.HTML += '<tbody>';
	if(item.productID){
		$rootScope.HTML += '<tr class="col-md-4">';
		$rootScope.HTML += '<td class="col-md-4" align="center" style="width:20%;border:1px solid #dddddd;padding: 8px;line-height: 1.42857143;vertical-align: top;">'+index+1+'</td>';
		$rootScope.HTML += '<td class="col-md-4" align="center" style="width:20%;border:1px solid #dddddd;padding: 8px;line-height: 1.42857143;vertical-align: top;">'+item.productInfo.productName+'</td>';
		$rootScope.HTML += '<td class="col-md-4"  align="right" style="width:20%;border:1px solid #dddddd;padding: 8px;line-height: 1.42857143;vertical-align: top;"><div align="left" style="width:30px; float:left;">'+$rootScope.SettingGeneral.settings.currencies_format+'</div> '+item.price+'</td>';
		$rootScope.HTML += '<td class="col-md-4"align="center" style="width:20%;border:1px solid #dddddd;padding: 8px;line-height: 1.42857143;vertical-align: top;">'+item.quantity+'</td>';
		$rootScope.HTML += '<td class="col-md-4" align="right" style="width:20%;border:1px solid #dddddd;padding: 8px;line-height: 1.42857143;vertical-align: top;" > <div align="left" style="width:30px; float:left;">'+$rootScope.SettingGeneral.settings.currencies_format+'</div> '+item.price * item.quantity+'</td>';
		$rootScope.HTML += '<tr>';
		}else if(!item.productID){
			$.each(item, function (ind, itm){
				if(itm.productInfo.productName){
				$rootScope.HTML += '<tr>';
				$rootScope.HTML += '<td class="col-md-4" align="center" style="width:20%;border:1px solid #dddddd;padding: 8px;line-height: 1.42857143;vertical-align: top;">'+index+1 +'</td>';
				$rootScope.HTML += '<td class="col-md-4" align="center" style="width:20%;border:1px solid #dddddd;padding: 8px;line-height: 1.42857143;vertical-align: top;">'+itm.productInfo.productName+'</td>';
				$rootScope.HTML += '<td class="col-md-4" align="right" style="width:20%;border:1px solid #dddddd;padding: 8px;line-height: 1.42857143;vertical-align: top;"> <div align="left" style="width:30px; float:left;">'+$rootScope.SettingGeneral.settings.currencies_format+'</div> '+itm.price+'</td>';
				$rootScope.HTML += '<td class="col-md-4" align="center" style="width:20%;border:1px solid #dddddd;padding: 8px;line-height: 1.42857143;vertical-align: top;">'+itm.quantity+'</td>';
				$rootScope.HTML += '<td class="col-md-4" align="right" style="width:20%;border:1px solid #dddddd;padding: 8px;line-height: 1.42857143;vertical-align: top;"><div align="left" style="width:30px; float:left;">'+$rootScope.SettingGeneral.settings.currencies_format+'</div> '+itm.price * itm.quantity+'</td>';
				$rootScope.HTML += '<tr>';
				}
			});
		} 
		
				$rootScope.HTML += '</tbody>';
		});	
				$rootScope.HTML += '</table>';
				return $rootScope.HTML;
}

$rootScope.applyDivOrderConfirmationTemplate = function(){
	$('body').append('<div id="addEmailTemplates" style="display:none;"></div>');
	$('#addEmailTemplates').append('<div ng-if="orderConfirmationTemplate" id="orderConfirmation" compile="getOrderConfirmationTemplate()"></div><div ng-if="orderTitle" id="orderTitle" compile="getorderTitle()"></div><div ng-if="newOrderTitle" id="newOrderTitle" compile="getnewOrderTitle()"></div><div ng-if="newOrderTemplate" id="newOrderTemplate" compile="getnewOrderTemplate()"></div>');
		 var ele = $('#addEmailTemplates');
		$compile(ele.contents())($rootScope);
}
$rootScope.getorderTitle = function(){
	return $rootScope.orderTitle;
}
$rootScope.getnewOrderTitle = function(){
	return $rootScope.newOrderTitle;
}
$rootScope.getOrderConfirmationTemplate = function(){
	return $rootScope.orderConfirmationTemplate;
}

$rootScope.getnewOrderTemplate = function(){
	return $rootScope.newOrderTemplate;
}
$rootScope.ResetVariendsModelBase = function(Vname,Vvalue,ListLoop,prodID){
	var hasElement  = false;
	$.each(ListLoop,function(index,item){
		if(index == Vname){
			hasElement = true;
		}
	})
	console.log($rootScope.ListProduct);
	if(!hasElement){
		//$rootScope.ListProduct[prodID]['productVarientModel'] = {};
		$rootScope.ListProduct[prodID]['productVarientModel'][Vname] = Vvalue;
		//$rootScope.ListProduct[prodID]['productVarientModelParent'] = Vname;
	}else{
		delete $rootScope.ListProduct[prodID]['productVarientModel'][Vname];
	}
	console.log($rootScope.ListProduct[prodID]['productVarientModel']);
}
$rootScope.returnLengthVarientList = function(prodID){
	var length = 0;
	$.each($rootScope.ListProduct[prodID]['productVarientModel'],function(index,item){
		if(item){
			length++;
		}
	});
	return length;
	
}
$rootScope.RenderOnDemand = function(VarienModel,product,myVal,VName){
	//if(myVal == 'soft'){
	//console.log('------------Staart---------------');
	//console.log(product);
	//console.log(VarienModel);
	//console.log(myVal);
	var vrCount = 1;
	var selfCentered = false;
	$.each(VarienModel,function(index,item){
			vrCount++;
		
		if(VName == index && item != myVal){
			selfCentered = true;
		}
	});
	var hasIndex = false;
	$.each(product.productVarients,function(index,item){
		var hasInnerOne = false;
		var counterFound = 0;
		$.each(item.name,function(indexInner,itemInner){
			if(itemInner == myVal){
				hasInnerOne = true;
				counterFound = 1;
			}
		});
		if(hasInnerOne){
				$.each(item.name,function(indexInner,itemInner){
					$.each(VarienModel,function(index,item){
						if(itemInner == item){
							counterFound++;
						}
					})
				});
		}
		if(counterFound >= vrCount){
			if(myVal == 'Pepsi'){
				console.log(counterFound);
			}
			hasIndex = true;
		}
		
	});
	/*if(myVal == 'Pepsi'){
		console.log(product.productVarients);
		console.log(hasIndex);
		console.log(vrCount);
		console.log(selfCentered);
		console.log('==========End===========');
	}*/
	if(!selfCentered){
		if((hasIndex || vrCount == 1)){
			return false;
		}else{
			return true;
		}
	}else{
		return true;
	}
	/*}else{
		return false;
	}*/
}

//Get Collections		
$rootScope.GetCollection = function(param){
		AzureMobileClient.getFilterData($rootScope.CollectionTable,{collectionVisibility: true}).then(
			function(data) {
				$rootScope.ListCollection = data;
				//$rootScope.GetPaymentGateways();
				$rootScope.loadPositionSetter();
				 $rootScope.$apply();
		});
	
};
$rootScope.GetPaymentGateways = function(param){
		AzureMobileClient.getFilterData($rootScope.PaymentGatewaysTable,{}).then(
			function(data) {
				$rootScope.ListPaymentGateways = data[0];
				$rootScope.ListPaymentGateways.payment_method = JSON.parse($rootScope.ListPaymentGateways.payment_method);
				$rootScope.ListPaymentMethod= $rootScope.ListPaymentGateways.payment_method;
				////console.log($rootScope.ListPaymentMethod);
				$rootScope.loadPositionSetter();
				 $rootScope.$apply();
				//$rootScope.GetNavigation();
		});
	
};
$rootScope.GetNavigation = function(param){
		AzureMobileClient.getFilterData($rootScope.NavigationTable,{}).then(
			function(data) {
				$rootScope.ListNavigation = data;
				$.each($rootScope.ListNavigation ,function(index,item){
					$rootScope.ListNavigation[index].link_list = JSON.parse($rootScope.ListNavigation[index].link_list);
				});
				////console.log($rootScope.ListNavigation);
				$rootScope.loadPositionSetter();
				 $rootScope.$apply();
				//$rootScope.GetPage();
		});
	
};
$rootScope.GetPage = function(param){
		AzureMobileClient.getFilterData($rootScope.PageTable,{pageVisibility: true}).then(
			function(data) {
				$rootScope.ListPage = data;
				$rootScope.loadPositionSetter();
				 $rootScope.$apply();
				//$rootScope.GetProductType();
		});
	
};
//Get Products Type		
$rootScope.GetProductType = function(param){
	AzureMobileClient.getFilterData($rootScope.ProductTypeTable,{}).then(
		function(data) {
			$rootScope.ListProductType = data;
			$rootScope.loadPositionSetter();
			 $rootScope.$apply();
			//$rootScope.GetProductVendor();
	});
};

//Get Products Vendors		
$rootScope.GetProductVendor = function(param){
	AzureMobileClient.getFilterData($rootScope.ProductVendorTable,{}).then(
		function(data) {
			$rootScope.ListProductVendor = data;
			$rootScope.loadPositionSetter();
			 $rootScope.$apply();
			//$rootScope.GetProduct();
	});
};

//Get Products		
$rootScope.GetProduct = function(param){
	AzureMobileClient.getFilterData($rootScope.ProductTable,{productVisibility: true}).then(
		function(data) {
			$rootScope.ListProduct = data;	
			
			$.each($rootScope.ListProduct,function(index,item){
				$rootScope.ListProduct[index]['productCollections'] = JSON.parse($rootScope.ListProduct[index]['productCollections']);
				$rootScope.ListProduct[index]['productImage'] = JSON.parse($rootScope.ListProduct[index]['productImage']);
				$rootScope.ListProduct[index]['productMultiOptionsList'] = JSON.parse($rootScope.ListProduct[index]['productMultiOptionsList']);
				$rootScope.ListProduct[index]['productVarients'] = JSON.parse($rootScope.ListProduct[index]['productVarients']);
				$rootScope.ListProduct[index]['productQuantity'] = 1;
				$rootScope.ListProduct[index]['productVarientModel'] = {};
				if(!$rootScope.ListProduct[index]['productPrice']){
					$rootScope.ListProduct[index]['productPrice'] = 0;
				}else if($rootScope.ListProduct[index]['productPrice'] == ''){
					$rootScope.ListProduct[index]['productPrice'] = 0;
				}
				
		   		angular.forEach($rootScope.ListCollection, function (collections) {
					angular.forEach($rootScope.ListProduct[index]['productCollections'], function (productCollection,ind) {
						////console.log(productCollection);
						////console.log(ind);
						if(productCollection.id == collections.id){
							$rootScope.ListProduct[index]['productCollections'][ind].urlParam = collections.collectionUrl;
						}
					});
				});
		   		angular.forEach($rootScope.ListCollection, function (collections) {
					angular.forEach($rootScope.ListProduct[index]['productCollections'], function (productCollection,ind) {
						////console.log(productCollection);
						////console.log(ind);
						if(productCollection.id == collections.id){
							$rootScope.ListProduct[index]['productCollections'][ind].urlParam = collections.collectionUrl;
						}
					});
				});
				angular.forEach($rootScope.ListProductType, function (ProductType) {
						if(ProductType.id == item.productType){
							$rootScope.ListProduct[index].ProductTypeName = ProductType.productTypeName;
						}
				});
				angular.forEach($rootScope.ListProductVendor, function (ProductVendor) {
						if(ProductVendor.id == item.productVendor){
							$rootScope.ListProduct[index].ProductVendorName = ProductVendor.productVendorName;
						}
				});
				var mutiListOptions = [];
				$.each(item.productVarients,function(indV,itmV){
							$.each(itmV.name,function(indInnerV,itmInnerV){
								if(!mutiListOptions[indInnerV]){
									mutiListOptions[indInnerV]  = [];
								}
								var hasValues = false;
								$.each(mutiListOptions[indInnerV],function(iD,iM){
									if(iM == itmInnerV){
										hasValues = true
									}
								});
								if(!hasValues){
									mutiListOptions[indInnerV].push(itmInnerV);
								}
							})
				});
				//console.log('---------------Starts------------');
				//console.log(mutiListOptions);
				//console.log('---------------Wnds------------');
				$.each(item.productMultiOptionsList,function(indx,itmx){
						   $rootScope.ListProduct[index].productMultiOptionsList[indx].value = itmx.value.split(',');
						   if(mutiListOptions[indx]){
						   		$rootScope.ListProduct[index].productMultiOptionsList[indx].value = mutiListOptions[indx];
						   }else{
						   		$rootScope.ListProduct[index].productMultiOptionsList[indx].value = [];
						   }
						   ////console.log($rootScope.varientsTypes[itmx.optionSelected]);
							if($rootScope.varientsTypes[itmx.optionSelected]){
								$rootScope.ListProduct[index].productMultiOptionsList[indx].name = $rootScope.varientsTypes[itmx.optionSelected];
							}else{
								////console.log($rootScope.ListProduct[index].productMultiOptionsList[indx].custom);
								$rootScope.ListProduct[index].productMultiOptionsList[indx].name = $rootScope.ListProduct[index].productMultiOptionsList[indx].custom;
							}
						////console.log(item);
				});
				
				////console.log('------------bdas');
				////console.log(mutiListOptions);
				 //var countersd = 0;
				/*$.each(item.productMultiOptionsList,function(indx,itmx){
						//console.log(itmx);
						if(item.productVarients && typeof(item.productVarients) == 'object'){
							$.each(item.productVarients,function(indss,itmxss){
								var hasIten = false;
								////console.log(itmxss);
								$.each((itmx.value),function(id,it){
									//console.log(itmxss.name[countersd]);
									//console.log(it);
									if(itmxss.name[countersd] && it){
										if(itmxss.name[countersd] == it){
											hasIten = true;
										}
									}
								});
								if(!hasIten){
									/*if(itmxss.name[countersd]){
										//console.log(itmxss.name[countersd]);
									}
								}
							
							});
						}
					countersd++;
				});*/
				
				
		   });
		    $rootScope.loadPositionSetter();
			//console.log($rootScope.ListProduct);
			$rootScope.$apply(function(){
				$('#Loader').hide();
			});
			
	});
};

//$rootScope.GetTheme();
$rootScope.GetCollection();
$rootScope.GetOrders();
$rootScope.GetPaymentGateways();
$rootScope.GetNavigation();
$rootScope.GetPage();
$rootScope.GetProductType();
$rootScope.GetProductVendor();
$rootScope.GetProduct();
//$rootScope.GetSettingGeneral();
$rootScope.GetSettingShippingCountry();
$rootScope.GetSettingNotification();
$rootScope.GetSettingNotificationOrder();

//Get Orders
$rootScope.GetOrders = function(param){
	AzureMobileClient.getFilterData($rootScope.OrderTable,{}).then(
		function(data) {
			$rootScope.ListOrders = data;
			$rootScope.loadPositionSetter();
			$rootScope.$apply();
			//$rootScope.GetProductVendor();
	});
};


$rootScope.ProductCount = function(collectionName,pageName){
	var count = 0;
	angular.forEach($rootScope.ListProduct, function (product) {
		var cts = 0;
		angular.forEach(product.productCollections, function (productCollection,ind) {
				if(productCollection.name == collectionName || productCollection.name == pageName){
					cts++;
				}
		});
		if(cts >= 2){
			count++;
		}
	});
	////console.log(count);
	return count;
}
$rootScope.GuestLogin = function(redirect){
	////console.log(redirect);
	$rootScope.User.info = {};
	$rootScope.User.info.CustomerEmail = $rootScope.GuestEmail;
	$rootScope.User.info.CustomerFirstName = $rootScope.GuestFirstName;
	$rootScope.User.info.CustomerLastName = $rootScope.GuestLastName;
	 $rootScope.User.info.GuestAuth = true;
	$rootScope.SetLocalStorage('User');
	if(redirect == 'window.history.back()'){
		window.history.back();
	}else{
		$location.path("/"+redirect);
	}
}
//Add to cart
$rootScope.addToCart = function(productID,productInfo,redirect){	
	////console.log(productInfo);

	var count = 1;
	$rootScope.varientSelected = productInfo.productVarientModel;
	var varient = productInfo.productVarientModel;
	var quantity = parseInt(productInfo.productQuantity);
	var totalCounts = 0;
		
	$.each($rootScope.varientSelected,function(ind,itm){
		totalCounts++;
	})
	////console.log(quantity);
	//return true;
	if(totalCounts > 0){
		
	var quantity = parseInt(productInfo.productQuantity);
	////console.log(productID+varrientArray);
	  $.each(productInfo.productVarients, function(indx, itmx){
		var varrientArray = '';
		var counters = 0;
		$.each($rootScope.varientSelected,function(index, item) {
	    ////console.log($rootScope.varientSelected);
	 	var varientItem = $rootScope.varientSelected[index];
			$.each(itmx.name,function(ind,itm){
			  if(itm == varientItem){
				  if(counters  <= totalCounts){
					  if(varrientArray == ''){
					  	varrientArray += varientItem;
					  }else{
					  	varrientArray += ', '+varientItem;
					  }
				  }
				 counters++;
			  }
			});
			
			/*$.each(varientItem,function(ind,itm){
				varrientArray += '|'+itm;
			});*/
			////console.log(varrientArray);
			//return true;
			//productID = productID+varrientArray;
		////console.log(varrientArray);
		
		if(counters == totalCounts){
			var nextIds = 0;
			////console.log(productID+varrientArray);
			
			if(!$rootScope.Cart[productID]){
				$rootScope.Cart[productID] = {};
				$rootScope.Cart[productID][varrientArray] = {};
				$rootScope.Cart[productID][varrientArray] = {productID:productID,quantity:quantity,productInfo:productInfo,price:itmx.price,sku:itmx.sku,barcode:itmx.barcode};
				//console.log(varrientArray);
				$rootScope.Cart[productID][varrientArray].productInfo.newPrice = itmx.price;
				
				//$rootScope.Cart[productID][varrientArray].productInfo.selectedVarients = varrientArray;
			}else{
				if($rootScope.Cart[productID][varrientArray]){
					$rootScope.Cart[productID][varrientArray].quantity = parseInt(productInfo.productQuantity) + parseInt($rootScope.Cart[productID][varrientArray].quantity);
				}else{					
					$rootScope.Cart[productID][varrientArray] = {};
					$rootScope.Cart[productID][varrientArray] = {productID:productID,quantity:quantity,productInfo:productInfo,price:itmx.price,sku:itmx.sku,barcode:itmx.barcode};
					//console.log(varrientArray);
					$rootScope.Cart[productID][varrientArray].productInfo.newPrice = itmx.price;
					
					//$rootScope.Cart[productID][varrientArray].productInfo.selectedVarients = varrientArray;
				}
			}
			//console.log($rootScope.Cart);
			
			
		}
	});
  });
		
	
	}else{
		if(!$rootScope.Cart[productID]){
			$rootScope.Cart[productID] = {productID:productID,quantity:quantity,productInfo:productInfo,price:productInfo.productPrice,sku:productInfo.sku,barcode:productInfo.barcode};
		}else{
			$rootScope.Cart[productID].quantity = parseInt(productInfo.productQuantity)+ parseInt($rootScope.Cart[productID].quantity);
		}
		
	}
	
	////console.log(productInfo);
	////console.log($rootScope.Cart[productID]);

	$rootScope.SetLocalStorage('Cart');
	if(redirect){
		if(redirect == 'window.history.back()'){
			window.history.back();
		}else{
			$location.path("/"+redirect);
		}
	}
}
$rootScope.IfCart= function(){	
	var length= 0;
	$.each($rootScope.Cart,function(index,item){
		   ////console.log('-----bda=========');
	      // //console.log(item);
	     ////console.log('-----bda=========');
		 ////console.log(item.productID);
		////console.log(item.productID);
		if(item.productID){
			length++
		}else{
			var hasProduct = false;
			$.each(item,function(ind,itm){
				if(itm.productID){
					hasProduct = true;
				}
			});
			if(hasProduct){
				length++
			}
		}
	});
	if(length == 0){
		return false;
	}else{
		return true;
	}

}
$rootScope.selectedVarients = function(item){
	var selectedCount = 0;
	$.each(item, function(indx, itmx){
			 if(itmx){
			 	selectedCount++;
			 }
		 });
		 return  selectedCount;
}
$rootScope.returnPrice = function(product){
		////console.log('Strat Price return.............');
		var count = 1;
		if(product.productMultiOptions){
		var returnPrice = 0;
		var requiredCount = 0;
		var selectedCount = 0;
		$.each(product.productMultiOptionsList,function(index,item){
			requiredCount++;
		});
		 $.each(product.productVarientModel, function(indx, itmx){
			 if(itmx){
			 	selectedCount++;
			 }
		 });
		 //console.log('-----required--------');
		 //console.log(product.productVarientModel);
		 //console.log(requiredCount);
		 //console.log(selectedCount);
				var varient = product.productVarientModel;
				
				var totalCounts = 0;
					
				$.each(varient,function(ind,itm){
					totalCounts++;
				})
				////console.log(quantity);
				//return true;
				if(totalCounts > 0){
					////console.log(product.productVarients);
				  $.each(product.productVarients, function(indx, itmx){
					var varrientArray = '';
					var counters = 0;
					$.each(varient,function(index, item) {
					////console.log($rootScope.varientSelected);
					var varientItem = varient[index];
						$.each(itmx.name,function(ind,itm){
						  if(itm == varientItem){
							  if(counters  <= totalCounts){
								  if(varrientArray == ''){
									varrientArray += varientItem;
								  }else{
									varrientArray += ','+varientItem;
								  }
							  }
							 counters++;
						  }
						});
					
					if(counters == requiredCount){
						//console.log('End Price return '+requiredCount+'......'+counters+'.......'+itmx.price);
						returnPrice =  itmx.price;
					}else if(selectedCount < requiredCount){
						//console.log('----------less----------');
						returnPrice =  -1;
					}
				});
			  });
					
				}
				
		}else{
			var returnPrice = product.productPrice;
		}
				return returnPrice;
	}
$rootScope.ReturnItems= function(){	
	var length= 0;
	$.each($rootScope.Cart,function(index,item){
		if(item.productID){
			length++
		}else{
			var hasProduct = false;
			$.each(item,function(ind,itm){
				if(itm.productID){
					hasProduct = true;
				}
			});
			if(hasProduct){
				length++
			}
		}
	});
	return length;
}
$rootScope.ReturnTax= function(){	
	var Tax= 0;
	////console.log($rootScope.Cart);
	if($rootScope.SettingsShippingCountry){
		$.each($rootScope.SettingsShippingCountry,function(index,item){
				if(item.CountryName == $rootScope.Customer.ShippingCountry){
					if(item.TaxRate){
						Tax = item.TaxRate;
					}
				}
		});
	}
	return Tax;
	
}
$rootScope.ReturnTaxPrice= function(){	
	var Amount= 0;
	////console.log($rootScope.Cart);
	$.each($rootScope.Cart,function(index,item){
			if(!item.productID){
			$.each(item,function(indx, itmx){
				if(indx != '$$hashKey'){
					Amount += parseInt(itmx.price) * parseInt(itmx.quantity);
				}
			})
		  }else{
			   Amount += parseInt(item.price) * parseInt(item.quantity);
		  }

	});
		if($rootScope.ReturnTax() > 0){
			var TaxAdd = Amount * $rootScope.ReturnTax() / 100;
				TaxAdd = TaxAdd.toFixed(2)
		 	var TotalAmount = parseFloat(TaxAdd);
				TotalAmount = TotalAmount.toFixed(2);
				return TotalAmount;
		}else{
			return 0;
		}
	
}
$rootScope.changeQuantity = function() {
      $rootScope.SetLocalStorage('Cart');
}
$rootScope.ReturnTotal= function(){	
	var Amount= 0;
	////console.log($rootScope.Cart);
	$.each($rootScope.Cart,function(index,item){
			if(!item.productID){
			$.each(item,function(indx, itmx){
				if(indx != '$$hashKey'){
					Amount += parseInt(itmx.price) * parseInt(itmx.quantity);
				}
			})
		  }else{
			   Amount += parseInt(item.price) * parseInt(item.quantity);
		  }

	});
		if($rootScope.ReturnTax() > 0){
			var TaxAdd = Amount * $rootScope.ReturnTax() / 100;
				TaxAdd = TaxAdd.toFixed(2)
		 	var TotalAmount =  parseFloat(Amount) + parseFloat(TaxAdd);
				TotalAmount = TotalAmount.toFixed(2);
				return TotalAmount;
		}else{
			return Amount.toFixed(2);
		}
	
}

$rootScope.RemoveCartItem= function(Productid,keyId){
	if(keyId){
		delete $rootScope.Cart[Productid][keyId];
	}else{
		////console.log(Productid);	
		delete $rootScope.Cart[Productid];
	}
	$rootScope.SetLocalStorage('Cart');
}

$rootScope.SetLocalStorage= function(Index){
	if(Index == 'Cart' || Index == ''){
		window.localStorage.setItem('Cart',JSON.stringify($rootScope.Cart));
		////console.log(window.localStorage.getItem('Cart'));
	}
	if(Index == 'User' || Index == ''){
		window.localStorage.setItem('User',JSON.stringify($rootScope.User.info));
		////console.log(window.localStorage.getItem('User'));
	}
}

$rootScope.GetLocalStorage= function(Index){
	////console.log($rootScope.User.info);
	if(Index == 'Cart' || Index == ''){
		if(window.localStorage.getItem('Cart')){
			$rootScope.Cart = JSON.parse(window.localStorage.getItem('Cart'));
		}
	}
	if(Index == 'User' || Index == ''){
		if(window.localStorage.getItem('User')){
			$rootScope.User.info = JSON.parse(window.localStorage.getItem('User'));

			$rootScope.Customer = $rootScope.User.info;
			////console.log($rootScope.User);
		}
	}
}

$rootScope.GetLocalStorage('');

$rootScope.CheckLogin = function(redirect){
	$rootScope.StartLogin = true;
	$('#error').hide();
	AzureMobileClient.getFilterData($rootScope.CustomerTable,{CustomerEmail:$rootScope.Customer.email,CustomerPassword:$rootScope.Customer.password}).then(
		function(data) {
			console.log(data[0]);
			if(data.length > 0){
				$rootScope.StartLogin = false;
				$rootScope.User.info = {};
				$rootScope.User.info = data[0];
				$rootScope.Customer = data[0];
				$rootScope.Customer.FirstName= $rootScope.Customer.CustomerFirstName;
				$rootScope.Customer.LastName = $rootScope.Customer.CustomerLastName;
				$rootScope.Customer.Email = $rootScope.Customer.CustomerEmail;
				$rootScope.Customer.Address = $rootScope.Customer.addressesFirst;
				$rootScope.Customer.AddressContinue = $rootScope.Customer.addressesSecond;
				$rootScope.Customer.PostCode = $rootScope.Customer.Zip;
				 $rootScope.User.info.GuestAuth = false;
				
				$rootScope.SetLocalStorage('User');
				$rootScope.$apply(function() { 
					if(redirect == 'window.history.back()'){
						window.history.back();
					}else{
						$location.path("/"+redirect);
					}
				});
				
			}else{
				$('#error').show();
				$rootScope.StartLogin = false;
				$rootScope.$apply();
			}
	});
}
$rootScope.ForgotPassword = function(redirect){
	$rootScope.StartForgotPassword = true;
	$rootScope.invalidEmail = false;
	$rootScope.ForgotEmail = false;
	AzureMobileClient.getFilterData($rootScope.CustomerTable,{CustomerEmail:$rootScope.Customer.forgotEmail}).then(
		function(data) {
			////console.log(data);
			if(data.length > 0){
				$rootScope.ForgotEmail = true;
				$rootScope.StartForgotPassword = false;
				console.log(data[0]);
				$rootScope.userData = data[0];
				$rootScope.emailTo  =  $rootScope.userData.CustomerEmail;
				$rootScope.fromName = $rootScope.storeName;
				$rootScope.byFrom   = $rootScope.SettingGeneral.contactEmail;
				$rootScope.toBCC    = '';
				$rootScope.subjectEmail = 'Forgot Password';
				$rootScope.emailBody = 'Hi '+ $rootScope.userData.CustomerFirstName + ' '+ $rootScope.userData.CustomerLastName+',<p>You have requested to reset your password for the <a href="http://'+$rootScope.storeName+'.fishry.com/" target="blank">'+$rootScope.storeName+'</a> at the email:<br/>'+$rootScope.userData.CustomerEmail+'</p><a href="http://'+$rootScope.storeName+'.fishry.com/reset_password/'+$rootScope.userData.id+'" target="blank">Reset my password</a><br><br/><p>If you did not request to reset your password, please disregard this email.</p>';
	
	var dataEmail = {data: $rootScope.emailBody, email: $rootScope.emailTo, subject: $rootScope.subjectEmail, toBCC: $rootScope.toBCC, byFrom: $rootScope.byFrom, fromName: $rootScope.fromName};
	//console.log(dataEmail);
	$rootScope.sendEmail(dataEmail);
	//update reset password flag
	var theData = {id: $rootScope.userData.id,passwordresetflag:'0',passwordresetdate: todayDate};
	//console.log(theData);
	AzureMobileClient.updateData($rootScope.CustomerTable, theData).then(
					function(insertedData) {
					  // $('.confirmation').show();
					   $rootScope.$apply(function() { 
					   		//$location.path("/admin/login"); 
						});
					},
					function(error) {
						console.log("An error has occurred: " + error.message);
					});
				
				$rootScope.$apply(function() { 
				$rootScope.ResetPasswordEmail = true;
					/*if(redirect == 'window.history.back()'){
						window.history.back();
					}else{
						$location.path("/"+redirect);
					}*/
				});
			}else{
				$rootScope.invalidEmail = true;
				$rootScope.StartForgotPassword = false;
				$rootScope.$apply();
			}
	});
}

$rootScope.checkResetPasswordFlag = function(){
AzureMobileClient.getFilterData($rootScope.CustomerTable,{id:$routeParams.id}).then(
		function(data) {
			if(data.length > 0){
			  $rootScope.userData = data[0];
			  var resetDate = moment($rootScope.userData.passwordresetdate).format()
			  var lastTwentyHours = moment($rootScope.userData.passwordresetdate).add('h', 24).format(); 
			   console.log(lastTwentyHours + 'last 24 hours');
			   console.log(resetDate + 'reset date');
			  if($rootScope.userData.passwordresetflag == 1 || todayDate > lastTwentyHours){
					$rootScope.issetPasswordResetFlag = true;
				}
		  }
	});
}

$rootScope.ResetPassword = function(redirect){
	$rootScope.StartResetPassword = true;
	$rootScope.invalidPassword = false;
	$rootScope.ResetPasswordDone = false;
	AzureMobileClient.getFilterData($rootScope.CustomerTable,{CustomerEmail:$rootScope.Customer.CustomerEmail,CustomerPassword:$rootScope.Customer.OldPassword}).then(
		function(data) {
			////console.log(data);
			if(data.length > 0){
				var UpdateDataReset = {
							id: data[0].id,
							CustomerPassword: $rootScope.Customer.NewPassword,
						}
						AzureMobileClient.updateData($rootScope.CustomerTable, UpdateDataReset).then(
							function(ResetData) {
									$rootScope.StartResetPassword = false;
									$rootScope.ResetPasswordDone = true;
									$rootScope.invalidPassword = false;
									$rootScope.$apply(function() { 
										if(redirect == 'window.history.back()'){
											alert('Reset password done');
											window.history.back();
										}else{
											$location.path("/"+redirect);
										}
									});
							})
				
			}else{
				$rootScope.invalidPassword = true;
				$rootScope.StartResetPassword = false;
				$rootScope.$apply();
			}
	});
}

$rootScope.ResetPasswordEmail = function(redirect){
	$rootScope.StartResetPassword = true;
	$rootScope.invalidPassword = false;
	$rootScope.ResetPasswordDone = false;
	if($routeParams.id){ 
	 var updateRecord = {id:$routeParams.id, CustomerPassword: $rootScope.Customer.NewPassword, passwordresetflag:'1',passwordresetdate:todayDate}
	 AzureMobileClient.updateData($rootScope.CustomerTable, updateRecord).then(
					function(insertedData) {
					   //alert(insertedData.loginPassword);
					   $rootScope.ResetPasswordMessage = true;
					   $location.path("/login"); 
					    $rootScope.$apply();
					},
					function(error) {
						console.log("An error has occurred: " + error.message);
					});
	 		 }
}

$rootScope.DuplicateEmailError = false;
$rootScope.SignUp = function(redirect){
	$rootScope.StartSignup = true;
	var NewUser = {
							CustomerFirstName: $rootScope.Customer.FirstName,
							CustomerLastName:$rootScope.Customer.LastName,
							CustomerEmail: $rootScope.Customer.Email,
							CustomerPassword:$rootScope.Customer.Password,
							Company: $rootScope.Customer.Company,
							Phone:$rootScope.Customer.Phone,
							addressesFirst: $rootScope.Customer.Address,
							addressesSecond:$rootScope.Customer.AddressContinue,
							City: $rootScope.Customer.City,
							Zip:$rootScope.Customer.PostCode,
							Country:$rootScope.Customer.Country
				  }
		////console.log(NewUser);
		AzureMobileClient.addData($rootScope.CustomerTable, NewUser).then(
			function(UserData) {
				$rootScope.DuplicateEmailError = false;
				$rootScope.StartSignup = false;
			   ////console.log(UserData);
			   $rootScope.User.info = UserData;
			   $rootScope.User.info.GuestAuth = false;
			   $rootScope.SetLocalStorage('User');
			   $rootScope.$apply(function() { 
			   		if(redirect == 'window.history.back()'){
						window.history.back();
					}else{
						$location.path("/"+redirect);
					}
			   		 
				});
			},
			function(error) {
				var responce  = JSON.parse(error.request.responseText);
				//console.log(responce);
				if(responce.status == 'Already Customer'){
					$rootScope.DuplicateEmailError = true;
					$rootScope.$apply();
				};
			});
}
$rootScope.UpdateUserInfo = function(redirect){
	$rootScope.StartUpdateUserInfo = true;
	var UpdateRow = {
							id:$rootScope.Customer.id,
							CustomerFirstName: $rootScope.Customer.FirstName,
							CustomerLastName:$rootScope.Customer.LastName,
							CustomerEmail: $rootScope.Customer.Email,
							CustomerPassword:$rootScope.Customer.Password,
							Company: $rootScope.Customer.Company,
							Phone:$rootScope.Customer.Phone,
							addressesFirst: $rootScope.Customer.Address,
							addressesSecond:$rootScope.Customer.AddressContinue,
							City: $rootScope.Customer.City,
							Zip:$rootScope.Customer.PostCode,
							Country:$rootScope.Customer.Country
				  }
		////console.log(NewUser);
		AzureMobileClient.updateData($rootScope.CustomerTable, UpdateRow).then(
			function(UserData) {
				$rootScope.StartUpdateUserInfo = false;
			    $rootScope.User.info = UserData;
			    $rootScope.SetLocalStorage('User');
			    $rootScope.$apply(function() { 
			   		if(redirect == 'window.history.back()'){
						window.history.back();
					}else{
						$location.path("/"+redirect);
					}
			   		 
				});
			},
			function(error) {
				
			});
}

$rootScope.Logout = function(redirect){
	var shippingCountry  = $rootScope.Customer.ShippingCountry;
	delete $rootScope.User.info;
	delete $rootScope.Customer;
	window.localStorage.removeItem('User');
	$rootScope.User.info = {};
	$rootScope.Customer = {};
	$rootScope.Customer.ShippingCountry = shippingCountry;
	$rootScope.SetLocalStorage('User');
	if(redirect){
		if(redirect == 'window.history.back()'){
			window.history.back();
		}else{
			$location.path("/"+redirect);
		}
	}
	$rootScope.$apply();
}
$rootScope.returnpaymentDescription = function (method){
	var paymentdescription = '';
	$.each($rootScope.ListPaymentMethod,function(index,item){
		if(item.name == method){
			paymentdescription = item.payInstruction;
		}
	});
	return paymentdescription;
}
$rootScope.Orders = {};
$rootScope.LoadOrders = function(){
	if($rootScope.User.info.id){
	$rootScope.StartOrdersLoad = true;
		AzureMobileClient.getFilterData($rootScope.OrderTable,{userID:$rootScope.User.info.id}).then(
			function(data) {
				if(data.length > 0){
					$rootScope.Orders = data;
					$rootScope.StartOrdersLoad = false;
					$rootScope.$apply();
				}else{
					$rootScope.StartOrdersLoad = false;
					$rootScope.$apply();
				}
		});
	}
}

$rootScope.SubmitOrder =  function(payment,redirect,clear){
	$rootScope.CreatCartHTML();
	
	$rootScope.StartSubmitOrder = true;
	
	if($rootScope.User.info.CustomerEmail == 'guest@fishry.com'){
		$.each($rootScope.Customer,function(index,item){
			$rootScope.User.info[index] = item;
		})
		//$rootScope.User.info.Country = $rootScope.Customer.Country;
	}
	////console.log($rootScope.User.info.id); return true;
	if(!$rootScope.SettingGeneral.settings.currencies_format){
		$rootScope.SettingGeneral.settings.currencies_format = 'PKR';
	}
	if($rootScope.User.info.id){
		var NewOrder = {
							userInfo: JSON.stringify($rootScope.User.info),
							userID: $rootScope.User.info.id,
							paymentInfo: payment,
							orderTotal:$rootScope.ReturnTotal(),
							productInfo: JSON.stringify($rootScope.Cart),
							taxInfo: $rootScope.ReturnTax(),
							orderCartHtml: $rootScope.HTML,
							orderCurrency: $rootScope.SettingGeneral.settings.currencies_format,
							orderid: ''
						}
	}else{
		var NewOrder = {
							userInfo: JSON.stringify($rootScope.User.info),
							userID: '',
							paymentInfo: payment,
							orderTotal:$rootScope.ReturnTotal(),
							productInfo: JSON.stringify($rootScope.Cart),
							taxInfo: $rootScope.ReturnTax(),
							orderCartHtml: $rootScope.HTML,
							orderCurrency: $rootScope.SettingGeneral.settings.currencies_format,
							orderid: ''
						}
	}
						
		AzureMobileClient.addData($rootScope.OrderTable, NewOrder).then(
			function(OrderData) {
				$rootScope.OrderInfo = OrderData;
				 var OrderIdEncoded =  OrderData.orderid; 
				 $rootScope.StartSubmitOrder = false;
				 var HtmlorderTitle  = $('#orderTitle').children('span').text();
				 HtmlorderTitle = HtmlorderTitle.replace('OrderIDRender',OrderIdEncoded);
				$('#orderTitle').children('span').text(HtmlorderTitle);
				 var HtmlnewOrderTitle  = $('#newOrderTitle').children('span').text();
				 HtmlnewOrderTitle = HtmlnewOrderTitle.replace('OrderIDRender',OrderIdEncoded);
				$('#newOrderTitle').children('span').text(HtmlnewOrderTitle);
			    $rootScope.$apply(function() {
				  
				   if(!clear){
					 $rootScope.Cart = {};
					 $rootScope.SetLocalStorage('Cart');
				   }
				   if(redirect == 'window.history.back()'){
						window.history.back();
					}else{
						console.log('END2___________');
						console.log($('#orderTitle').text());
						console.log($('#newOrderTitle').text());
						console.log('END___________');
						$rootScope.SendConfirmEmail(OrderData);
						$location.path(redirect);
					}
				 });
			},
			function(error) {
				////console.log("An error has occurred: " + error.message);
			});
}
$rootScope.UpdatePaymentMethod = function(Method){
	$rootScope.PaymentMethod  = Method;
	$rootScope.$apply();
}
$rootScope.SendConfirmEmail = function (OrderData){
	    //console.log('em here order submitted starttt-----');
		$rootScope.submitedOrder = OrderData;
		$rootScope.submitedOrder.userInfo = JSON.parse($rootScope.submitedOrder.userInfo);
		$rootScope.submitedOrder.productInfo = JSON.parse($rootScope.submitedOrder.productInfo);
		$rootScope.paymentInfo = $rootScope.submitedOrder.paymentInfo;
		$rootScope.emailTo   = $rootScope.submitedOrder.userInfo.Email;
		$rootScope.byFrom = $rootScope.SettingGeneral.contactEmail;
		$rootScope.toBCC = '';
		$rootScope.subjectEmail =  $('#orderTitle').children().html(); 
		//$rootScope.subjectEmail = 'Order confirmation for order '+$rootScope.submitedOrder.orderid;  
		$rootScope.emailBody =  $('#orderConfirmation').html();
		var dataEmail = {data: $rootScope.emailBody, email: $rootScope.emailTo, subject: $rootScope.subjectEmail, toBCC: $rootScope.toBCC, byFrom: $rootScope.byFrom, fromName: $rootScope.storeName};
		$rootScope.sendEmail(dataEmail);
		//console.log('em here order submitted enddd-----');
		
		
	    //console.log('new order submitted starttt-----');
		//console.log($rootScope.submitedOrder);
		$rootScope.emailTo =  $rootScope.subscriptionEmails;
		$rootScope.byFrom = $rootScope.SettingGeneral.contactEmail;
		$rootScope.toBCC = '';
		$rootScope.subjectEmail = $('#newOrderTitle').children().html();
		//$rootScope.subjectEmail = $rootScope.storeName +' Order '+ $rootScope.submitedOrder.orderid + ' placed by '+$rootScope.submitedOrder.userInfo.FirstName +' '+$rootScope.submitedOrder.userInfo.LastName;  
		$rootScope.emailBody =  $('#newOrderTemplate').html();
		//console.log('----------------------------------------');
		//console.log($rootScope.emailBody);
		var dataEmail = {data: $rootScope.emailBody, email: $rootScope.emailTo, subject: $rootScope.subjectEmail, toBCC: $rootScope.toBCC, byFrom: $rootScope.byFrom, fromName: $rootScope.storeName};
		$rootScope.sendEmail(dataEmail);
		//console.log('new order submitted enddd-----');		
}

$rootScope.returnProducts = function (array){
		$rootScope.produtCount = {};
		//console.log(array);
		$.each(array,function(ind,itm){
			$.each(itm.productInfo,function(index,item){
				if($rootScope.produtCount[index]){
					console.log('item');
					console.log(item.quantity);
					if(typeof item.quantity == "undefined"){
						console.log('item 1st loop undefined');
						$.each(item,function(key,value){
						console.log(value.quantity);
						$rootScope.produtCount[index]['count'] = parseInt($rootScope.produtCount[index]['count']) + parseInt(value.quantity);
						});
					}else if(typeof item.quantity != "undefined"){
					  $rootScope.produtCount[index]['count'] = $rootScope.produtCount[index]['count'] + item.quantity;
					}
				}else if(typeof item.quantity == "undefined"){
					console.log('item undefined');
					$.each(item,function(key,value){
					console.log(value.quantity);
					$rootScope.produtCount[index] = {};
					$rootScope.produtCount[index]['count'] = value.quantity;
					$rootScope.produtCount[index]['pInfo'] = value.productInfo;
					});
				}else if(typeof item.quantity != "undefined"){
					console.log('item else');
					console.log(item.productInfo);
					$rootScope.produtCount[index] = {};
					if(item.quantity!=''){
					$rootScope.produtCount[index]['count'] = item.quantity;
					$rootScope.produtCount[index]['pInfo'] = item.productInfo;
					}
				}
			})
		});
		
		var arr = sortObject($rootScope.produtCount);
		$rootScope.produtCount = arr
		return $rootScope.produtCount;
	}
	
$rootScope.$on('$routeChangeSuccess', function () {
			if($rootScope.LoadPositions >= 100){			
								$('#loadingbar').show();
								$('#loadingbar').width(100+'%');
								setTimeout(function(){
									$('#loadingbar').hide();
									$('#loadingbar').width(0+'%');
								},1000);
			}
	});
	
$('#loadingbar').width($rootScope.LoadPositions+'%');	
//send email
 $rootScope.sendEmail = function(dataEmail){
	$http({method: 'POST', url: 'https://fishry.azure-mobile.net/api/send_grid', data: dataEmail, headers: {'Content-Type': 'application/json'}}).
		success(function(data, status, headers, config) {
		  //console.log(data);
		}).
		error(function(data, status, headers, config) {
		  //console.log('error start');
		});
		
		
		
  }
  
  
}


angular.module('App.filters', []).filter('CustomFilter', [function () {
    return function (items, filterType) {
		////console.log(items);
		////console.log(filterType);
        if (!angular.isUndefined(items) && !angular.isUndefined(filterType)) {
            var tempItems = [];
			if(filterType.collection){
                angular.forEach(items, function (item,ind) {
					 var addCollection = false;
					 angular.forEach(item.productCollections, function (collection) {
                        if(filterType.collection == collection.name || filterType.collection == 'all' || filterType.collection == collection.urlParam || filterType.collection == collection.id){
							addCollection = true;
						}
                	});
					if(addCollection){
						 item.Index = ind;
                        tempItems.push(item);
					}
                });
		    }else if(filterType.productName){
                angular.forEach(items, function (item,ind) {
					 if(filterType.productName == item.productName){
						 item.Index = ind;
					 	tempItems.push(item);
					 }
                });
		    }else if(filterType.productUrl){
                angular.forEach(items, function (item,ind) {
					 if(filterType.productUrl == item.productUrl){
						 item.Index = ind;
					 	tempItems.push(item);
					 }
                });
		    }else if(filterType.pageUrl || filterType.pageId ){
                angular.forEach(items, function (item,ind) {
					 if(filterType.pageUrl == item.pageUrl || filterType.pageId == item.id){
						 item.Index = ind;
					 	tempItems.push(item);
					 }
                });
		    }else if(!filterType.frontPage){
                angular.forEach(items, function (item,ind) {
					if(item.collectionName != 'Frontpage'){
						item.Index = ind;
                        tempItems.push(item);
					}
                });
			}
            return tempItems;
        } else {
            return items;
        }
    };
}]);


