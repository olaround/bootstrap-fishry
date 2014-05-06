// JavaScript Document
window.appInsights={queue:[],applicationInsightsId:null,accountId:null,appUserId:null,configUrl:null,start:function(n){function u(n,t){n[t]=function(){var i=arguments;n.queue.push(function(){n[t].apply(n,i)})}}function f(n){var t=document.createElement("script");return t.type="text/javascript",t.src=n,t.async=!0,t}function r(){i.appendChild(f("//az416426.vo.msecnd.net/scripts/ai.0.js"))}var i,t;this.applicationInsightsId=n;u(this,"logEvent");u(this,"logPageView");i=document.getElementsByTagName("script")[0].parentNode;this.configUrl===null?r():(t=f(this.configUrl),t.onload=r,t.onerror=r,i.appendChild(t));this.start=function(){}}};

appInsights.start("e6755802-e3e3-448c-b682-cbb443f40be5");
appInsights.logPageView();
function AECtrl ($rootScope,$location,AzureMobileClient,$routeParams,$cookies) {
	//alert(localStorage.getItem('myFirstKey'));
	//console.log($routeParams);
	$rootScope.$location = $location;	
	$rootScope.Cart = {};
	$rootScope.User = {};
	$rootScope.User.info = {};
	$rootScope.isCollapsed = true;
	$rootScope.OrderInfo = true;
	$rootScope.PaymentMethod = '';
	$rootScope.SettingGeneral = '';
	$rootScope.SettingShippingCountry = {};
	$rootScope.SettingShipping = {};
	$rootScope.BaseUrl = BaseUrl;
	$rootScope.StartLogin = false;
	$rootScope.StartSignup = false;
	$rootScope.StartSubmitOrder = false;
	$rootScope.LoadPositions = 10;
	$rootScope.Incremetor = 8;
	
	$rootScope.Customer = {};
	$rootScope.ErrorLogin = false;
	$rootScope.GuestEmail = 'guest@fishry.com';
	$rootScope.GuestFirstName = 'Guest';
	$rootScope.GuestLastName = 'User';
	$rootScope.varientsTypes = ['Title','Size','Color','Material','Style','custom'];
	$rootScope.varientSelected = {};
    $rootScope.userVraients = {};
	$rootScope.varientSizeValue = {};
	
		
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

//Main Scopes Names	
	$rootScope.ThemeSettings = {};
	$rootScope.ListCollection = {};
	$rootScope.ListProduct = {};
	$rootScope.ListProductType = {};
	$rootScope.ListProductVendor = {};
	$rootScope.ListPage = {};
	$rootScope.ListNavigation = {};
	$rootScope.ListPaymentGateways = {};
	$rootScope.ListPaymentMethod = {};
	
	
	
//Get Theme

$rootScope.loadPositionSetter = function(){
	$('#loadingbar').show();
	$rootScope.LoadPositions = $rootScope.Incremetor  + $rootScope.LoadPositions;
	$('#loadingbar').width($rootScope.LoadPositions+'%');
	console.log($rootScope.LoadPositions);
	if($rootScope.LoadPositions == 90){		
			$rootScope.LoadPositions = 100;
			$('#loadingbar').width($rootScope.LoadPositions+'%');
			$('.container').fadeIn(function(){
				$('#loadingbar').hide();
				$('#loadingbar').width(0+'%');
			});
		
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

$rootScope.GetSettingShippingCountry = function(param){
		AzureMobileClient.getFilterData($rootScope.SettingsShippingCountryTable,{}).then(
			function(data) {
				if(data.length > 0){
					$rootScope.SettingsShippingCountryTable = data;
					AzureMobileClient.getFilterData($rootScope.SettingsShippingTable,{}).then(
					function(data) {
						if(data.length > 0){
							$rootScope.SettingShipping = data;
							$.each($rootScope.SettingShipping,function(index,item){
								var countryName = false;
									$.each($rootScope.SettingsShippingCountryTable,function(ind,itm){
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
						 }
						 $rootScope.loadPositionSetter();
						 $rootScope.$apply();
					});
					
					
					
					
					
				}
				//$rootScope.GetCollection();
		});
	
};

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
				//console.log($rootScope.ListPaymentMethod);
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
				//console.log($rootScope.ListNavigation);
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
			//console.log(data);		
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
						//console.log(productCollection);
						//console.log(ind);
						if(productCollection.id == collections.id){
							$rootScope.ListProduct[index]['productCollections'][ind].urlParam = collections.collectionUrl;
						}
					});
				});
		   		angular.forEach($rootScope.ListCollection, function (collections) {
					angular.forEach($rootScope.ListProduct[index]['productCollections'], function (productCollection,ind) {
						//console.log(productCollection);
						//console.log(ind);
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
				$.each(item.productMultiOptionsList,function(indx,itmx){
						   $rootScope.ListProduct[index].productMultiOptionsList[indx].value = itmx.value.split(',');
						   //console.log($rootScope.varientsTypes[itmx.optionSelected]);
							if($rootScope.varientsTypes[itmx.optionSelected]){
								$rootScope.ListProduct[index].productMultiOptionsList[indx].name = $rootScope.varientsTypes[itmx.optionSelected];
							}else{
								//console.log($rootScope.ListProduct[index].productMultiOptionsList[indx].custom);
								$rootScope.ListProduct[index].productMultiOptionsList[indx].name = $rootScope.ListProduct[index].productMultiOptionsList[indx].custom;
							}
						//console.log(item);
				});
				 //var countersd = 0;
				/*$.each(item.productMultiOptionsList,function(indx,itmx){
						console.log(itmx);
						if(item.productVarients && typeof(item.productVarients) == 'object'){
							$.each(item.productVarients,function(indss,itmxss){
								var hasIten = false;
								//console.log(itmxss);
								$.each((itmx.value),function(id,it){
									console.log(itmxss.name[countersd]);
									console.log(it);
									if(itmxss.name[countersd] && it){
										if(itmxss.name[countersd] == it){
											hasIten = true;
										}
									}
								});
								if(!hasIten){
									/*if(itmxss.name[countersd]){
										console.log(itmxss.name[countersd]);
									}
								}
							
							});
						}
					countersd++;
				});*/
				
				
		   });
		    $rootScope.loadPositionSetter();
			console.log($rootScope.ListProduct);
			$rootScope.$apply(function(){
				$('#Loader').hide();
			});
			
	});
};

$rootScope.GetTheme();
$rootScope.GetCollection();
$rootScope.GetPaymentGateways();
$rootScope.GetNavigation();
$rootScope.GetPage();
$rootScope.GetProductType();
$rootScope.GetProductVendor();
$rootScope.GetProduct();
$rootScope.GetSettingGeneral();
$rootScope.GetSettingShippingCountry();




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
	//console.log(count);
	return count;
}
$rootScope.GuestLogin = function(redirect){
	//console.log(redirect);
	$rootScope.User.info = {};
	$rootScope.User.info.CustomerEmail = $rootScope.GuestEmail;
	$rootScope.User.info.CustomerFirstName = $rootScope.GuestFirstName;
	$rootScope.User.info.CustomerLastName = $rootScope.GuestLastName;
	$rootScope.SetLocalStorage('User');
	$location.path("/"+redirect);
}
//Add to cart
$rootScope.addToCart = function(productID,productInfo,redirect){	
	//console.log(productInfo);

	var count = 1;
	$rootScope.varientSelected = productInfo.productVarientModel;
	var varient = productInfo.productVarientModel;
	var quantity = parseInt(productInfo.productQuantity);
	var totalCounts = 0;
		
	$.each($rootScope.varientSelected,function(ind,itm){
		totalCounts++;
	})
	//console.log(quantity);
	//return true;
	if(totalCounts > 0){
	var quantity = parseInt(productInfo.productQuantity);
	//console.log(productID+varrientArray);
	  $.each(productInfo.productVarients, function(indx, itmx){
		var varrientArray = '';
		var counters = 0;
		$.each($rootScope.varientSelected,function(index, item) {
	    //console.log($rootScope.varientSelected);
	 	var varientItem = $rootScope.varientSelected[index];
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
			
			/*$.each(varientItem,function(ind,itm){
				varrientArray += '|'+itm;
			});*/
			//console.log(varrientArray);
			//return true;
			//productID = productID+varrientArray;
		//console.log(varrientArray);
		
		if(counters == totalCounts){
			var nextIds = 0;
			$.each($rootScope.Cart , function(index,index){
			})
			//console.log(productID+varrientArray);
			
			if(!$rootScope.Cart[productID]){
				$rootScope.Cart[productID] = {};
				$rootScope.Cart[productID][varrientArray] = {};
				$rootScope.Cart[productID][varrientArray] = {productID:productID,quantity:quantity,productInfo:productInfo};
				$rootScope.Cart[productID][varrientArray].productInfo.newPrice = itmx.price;
				//$rootScope.Cart[productID][varrientArray].productInfo.selectedVarients = varrientArray;
			}else{
				if($rootScope.Cart[productID][varrientArray]){
					$rootScope.Cart[productID][varrientArray].quantity = parseInt(productInfo.productQuantity) + parseInt($rootScope.Cart[productID][varrientArray].quantity);
				}else{
					$rootScope.Cart[productID][varrientArray] = {};
					$rootScope.Cart[productID][varrientArray] = {productID:productID,quantity:quantity,productInfo:productInfo};
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
			$rootScope.Cart[productID] = {productID:productID,quantity:quantity,productInfo:productInfo};
		}else{
			$rootScope.Cart[productID].quantity = parseInt(productInfo.productQuantity)+ parseInt($rootScope.Cart[productID].quantity);
		}
		
	}
	
	//console.log(productInfo);
	//console.log($rootScope.Cart[productID]);

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
		//console.log('-----bda=========');
	    //console.log(item);
		//console.log(item.productID);
		//console.log(item.productID);
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
$rootScope.returnPrice = function(product){
		//console.log('Strat Price return.............');
		var count = 1;
		var returnPrice = product.productPrice;
		var requiredCount = 0;
		$.each(product.productMultiOptionsList,function(index,item){
			requiredCount++;
		})
				var varient = product.productVarientModel;
				
				var totalCounts = 0;
					
				$.each(varient,function(ind,itm){
					totalCounts++;
				})
				//console.log(quantity);
				//return true;
				if(totalCounts > 0){
				  $.each(product.productVarients, function(indx, itmx){
					var varrientArray = '';
					var counters = 0;
					$.each(varient,function(index, item) {
					//console.log($rootScope.varientSelected);
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
						//console.log('End Price return 2.............'+itmx.price);
						returnPrice =  itmx.price;
					}
				});
			  });
					
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
$rootScope.ReturnTotal= function(){	
	var Amount= 0;
	//console.log($rootScope.Cart);
	$.each($rootScope.Cart,function(index,item){
			if(!item.productID){
			$.each(item,function(indx, itmx){
				if(indx != '$$hashKey'){
					Amount += parseInt(itmx.productInfo.newPrice) * parseInt(itmx.quantity);
				}
			})
		  }else{
			   Amount += parseInt(item.productInfo.productPrice) * parseInt(item.quantity);
		  }

	});
	
		 return Amount;
	
}
$rootScope.RemoveCartItem= function(Productid,keyId){
	if(keyId){
		delete $rootScope.Cart[Productid][keyId];
	}else{
		//console.log(Productid);	
		delete $rootScope.Cart[Productid];
	}
	$rootScope.SetLocalStorage('Cart');
}
$rootScope.SetLocalStorage= function(Index){
	if(Index == 'Cart' || Index == ''){
		window.localStorage.setItem('Cart',JSON.stringify($rootScope.Cart));
		//console.log(window.localStorage.getItem('Cart'));
	}
	if(Index == 'User' || Index == ''){
		window.localStorage.setItem('User',JSON.stringify($rootScope.User.info));
		//console.log(window.localStorage.getItem('User'));
	}
}
$rootScope.GetLocalStorage= function(Index){
	//console.log($rootScope.User.info);
	if(Index == 'Cart' || Index == ''){
		if(window.localStorage.getItem('Cart')){
			$rootScope.Cart = JSON.parse(window.localStorage.getItem('Cart'));
		}
	}
	if(Index == 'User' || Index == ''){
		if(window.localStorage.getItem('User')){
			$rootScope.User.info = JSON.parse(window.localStorage.getItem('User'));
			$rootScope.Customer = $rootScope.User.info;
			//console.log($rootScope.User);
		}
	}
}
$rootScope.GetLocalStorage('');

$rootScope.CheckLogin = function(redirect){
	$rootScope.StartLogin = true;
	$('#error').hide();
	AzureMobileClient.getFilterData($rootScope.CustomerTable,{CustomerEmail:$rootScope.Customer.email,CustomerPassword:$rootScope.Customer.password}).then(
		function(data) {
			//console.log(data);
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
			}
	});
}

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
		//console.log(NewUser);
		AzureMobileClient.addData($rootScope.CustomerTable, NewUser).then(
			function(UserData) {
				$rootScope.StartSignup = false;
			   //console.log(UserData);
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
				//console.log("An error has occurred: " + error.message);
			});
}
$rootScope.Logout = function(){
	delete $rootScope.User.info;
	window.localStorage.removeItem('User');
}

$rootScope.SubmitOrder =  function(payment,redirect,clear){
	$rootScope.StartSubmitOrder = true;
	if($rootScope.User.info.CustomerEmail == 'guest@fishry.com'){
		$.each($rootScope.Customer,function(index,item){
			$rootScope.User.info[index] = item;
		})
		//$rootScope.User.info.Country = $rootScope.Customer.Country;
	}
		var NewOrder = {
							userInfo: JSON.stringify($rootScope.User.info),
							paymentInfo: payment,
							orderTotal:$rootScope.ReturnTotal(),
							productInfo: JSON.stringify($rootScope.Cart),
						}
		AzureMobileClient.addData($rootScope.OrderTable, NewOrder).then(
			function(OrderData) {
				$rootScope.StartSubmitOrder = false;
			   $rootScope.OrderInfo = OrderData;
			   if(!clear){
			  	 $rootScope.Cart = {};
			   	 $rootScope.SetLocalStorage('Cart');
			   }
			   $rootScope.$apply(function() {
				   if(redirect == 'window.history.back()'){
						window.history.back();
					}else{
						$location.path(redirect);
					}
				   	 
			   });
			},
			function(error) {
				//console.log("An error has occurred: " + error.message);
			});
}

$rootScope.$on('$routeChangeSuccess', function () {		
			if($rootScope.LoadPositions == 100){			
								$('#loadingbar').show();
								$('#loadingbar').width(100+'%');
								setTimeout(function(){
									$('#loadingbar').hide();
									$('#loadingbar').width(0+'%');
								},1000);
			}
	});
	$('#loadingbar').width($rootScope.LoadPositions+'%');
}
angular.module('App.filters', []).filter('CustomFilter', [function () {
    return function (items, filterType) {
		//console.log(items);
		//console.log(filterType);
        if (!angular.isUndefined(items) && !angular.isUndefined(filterType)) {
            var tempItems = [];
			if(filterType.collection){
                angular.forEach(items, function (item) {
					 var addCollection = false;
					 angular.forEach(item.productCollections, function (collection) {
                        if(filterType.collection == collection.name || filterType.collection == 'all' || filterType.collection == collection.urlParam){
							addCollection = true;
						}
                	});
					if(addCollection){
                        tempItems.push(item);
					}
                });
		    }else if(filterType.productName){
                angular.forEach(items, function (item) {
					 if(filterType.productName == item.productName){
					 	tempItems.push(item);
					 }
                });
		    }else if(filterType.productUrl){
                angular.forEach(items, function (item) {
					 if(filterType.productUrl == item.productUrl){
					 	tempItems.push(item);
					 }
                });
		    }else if(filterType.pageUrl){
                angular.forEach(items, function (item) {
					 if(filterType.pageUrl == item.pageUrl){
					 	tempItems.push(item);
					 }
                });
		    }else if(!filterType.frontPage){
                angular.forEach(items, function (item) {
					if(item.collectionName != 'Frontpage'){
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
