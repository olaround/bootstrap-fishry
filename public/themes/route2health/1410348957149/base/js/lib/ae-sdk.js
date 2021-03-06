// JavaScript Document
function AECtrl ($scope, $location,AzureMobileClient,$rootScope,$routeParams,$cookies) {
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
	$rootScope.BaseUrl = BaseUrl;
	
	$rootScope.Customer = {};
	$rootScope.ErrorLogin = false;
	$scope.GuestEmail = 'guest@fishry.com';
	$scope.GuestFirstName = 'Guest';
	$scope.GuestLastName = 'User';
	$scope.varientsTypes = ['Title','Size','Color','Material','Style','custom'];
	$scope.varientSelected = {};
    $scope.userVraients = {};
	$scope.varientSizeValue = {};
	
		
//Table Names	
	$scope.CollectionTable = 'collection';
	$scope.ProductTable = 'product';
	$scope.ProductTypeTable = 'product_type';
	$scope.ProductVendorTable = 'product_vendor';
	$scope.CustomerTable = 'customer';
	$scope.OrderTable = 'order';
	$scope.PageTable = 'page';
	$scope.NavigationTable = 'link_list';
	$scope.PaymentGatewaysTable = 'settings_payment';
	$scope.ThemeTable = 'theme';
	$scope.SettingsGeneralTable = 'settings_general';

//Main Scopes Names	
	$scope.ThemeSettings = {};
	$scope.ListCollection = {};
	$scope.ListProduct = {};
	$scope.ListProductType = {};
	$scope.ListProductVendor = {};
	$scope.ListPage = {};
	$scope.ListNavigation = {};
	$scope.ListPaymentGateways = {};
	$scope.ListPaymentMethod = {};
	
	
//Get Theme
$scope.GetTheme = function(param){
		AzureMobileClient.getFilterData($scope.ThemeTable,{theme_main:'1'}).then(
			function(data) {
				if(data.length > 0){
					$scope.ThemeSettings = data[0];
					$scope.ThemeSettings.theme_settings = JSON.parse($scope.ThemeSettings.theme_settings);
				}
				//$scope.GetCollection();
		});
	
};
$scope.GetSettingGeneral = function(param){
		AzureMobileClient.getFilterData($scope.SettingsGeneralTable,{}).then(
			function(data) {
				if(data.length > 0){
					$scope.SettingGeneral = data[0];
					$scope.SettingGeneral.settings = JSON.parse($scope.SettingGeneral.settings);
				}
		});
	
};
	
//Get Collections		
$scope.GetCollection = function(param){
		AzureMobileClient.getFilterData($scope.CollectionTable,{}).then(
			function(data) {
				$scope.ListCollection = data;
				//$scope.GetPaymentGateways();
		});
	
};
$scope.GetPaymentGateways = function(param){
		AzureMobileClient.getFilterData($scope.PaymentGatewaysTable,{}).then(
			function(data) {
				$scope.ListPaymentGateways = data[0];
				$scope.ListPaymentGateways.payment_method = JSON.parse($scope.ListPaymentGateways.payment_method);
				$scope.ListPaymentMethod= $scope.ListPaymentGateways.payment_method;
				console.log($scope.ListPaymentMethod);
				//$scope.GetNavigation();
		});
	
};
$scope.GetNavigation = function(param){
		AzureMobileClient.getFilterData($scope.NavigationTable,{}).then(
			function(data) {
				$scope.ListNavigation = data;
				$.each($scope.ListNavigation ,function(index,item){
					$scope.ListNavigation[index].link_list = JSON.parse($scope.ListNavigation[index].link_list);
				});
				console.log($scope.ListNavigation);
				//$scope.GetPage();
		});
	
};
$scope.GetPage = function(param){
		AzureMobileClient.getFilterData($scope.PageTable,{}).then(
			function(data) {
				$scope.ListPage = data;
				//$scope.GetProductType();
		});
	
};
//Get Products Type		
$scope.GetProductType = function(param){
	AzureMobileClient.getFilterData($scope.ProductTypeTable,{}).then(
		function(data) {
			$scope.ListProductType = data;
			//$scope.GetProductVendor();
	});
};

//Get Products Vendors		
$scope.GetProductVendor = function(param){
	AzureMobileClient.getFilterData($scope.ProductVendorTable,{}).then(
		function(data) {
			$scope.ListProductVendor = data;
			//$scope.GetProduct();
	});
};

//Get Products		
$scope.GetProduct = function(param){
	AzureMobileClient.getFilterData($scope.ProductTable,{}).then(
		function(data) {
			$scope.ListProduct = data;	
			console.log(data);		
			$.each($scope.ListProduct,function(index,item){
				$scope.ListProduct[index]['productCollections'] = JSON.parse($scope.ListProduct[index]['productCollections']);
				$scope.ListProduct[index]['productImage'] = JSON.parse($scope.ListProduct[index]['productImage']);
				$scope.ListProduct[index]['productMultiOptionsList'] = JSON.parse($scope.ListProduct[index]['productMultiOptionsList']);
				$scope.ListProduct[index]['productVarients'] = JSON.parse($scope.ListProduct[index]['productVarients']);
				$scope.ListProduct[index]['productQuantity'] = 1;
				$scope.ListProduct[index]['productVarientModel'] = {};
		   		angular.forEach($scope.ListCollection, function (collections) {
					angular.forEach($scope.ListProduct[index]['productCollections'], function (productCollection,ind) {
						//console.log(productCollection);
						//console.log(ind);
						if(productCollection.id == collections.id){
							$scope.ListProduct[index]['productCollections'][ind].urlParam = collections.collectionUrl;
						}
					});
				});
		   		angular.forEach($scope.ListCollection, function (collections) {
					angular.forEach($scope.ListProduct[index]['productCollections'], function (productCollection,ind) {
						//console.log(productCollection);
						//console.log(ind);
						if(productCollection.id == collections.id){
							$scope.ListProduct[index]['productCollections'][ind].urlParam = collections.collectionUrl;
						}
					});
				});
				angular.forEach($scope.ListProductType, function (ProductType) {
						if(ProductType.id == item.productType){
							$scope.ListProduct[index].ProductTypeName = ProductType.productTypeName;
						}
				});
				angular.forEach($scope.ListProductVendor, function (ProductVendor) {
						if(ProductVendor.id == item.productVendor){
							$scope.ListProduct[index].ProductVendorName = ProductVendor.productVendorName;
						}
				});
				$.each(item.productMultiOptionsList,function(indx,itmx){
						   $scope.ListProduct[index].productMultiOptionsList[indx].value = itmx.value.split(',');
						   //console.log($scope.varientsTypes[itmx.optionSelected]);
							if($scope.varientsTypes[itmx.optionSelected]){
								$scope.ListProduct[index].productMultiOptionsList[indx].name = $scope.varientsTypes[itmx.optionSelected];
							}else{
								//console.log($scope.ListProduct[index].productMultiOptionsList[indx].custom);
								$scope.ListProduct[index].productMultiOptionsList[indx].name = $scope.ListProduct[index].productMultiOptionsList[indx].custom;
							}
						//console.log(item);
				});
				//$rootScope.numberOfPages();
		   });
			console.log($scope.ListProduct);
			$scope.$apply(function(){
				$('#Loader').hide();
			});
	});
};

$scope.GetTheme();
$scope.GetCollection();
$scope.GetPaymentGateways();
$scope.GetNavigation();
$scope.GetPage();
$scope.GetProductType();
$scope.GetProductVendor();
$scope.GetProduct();
$scope.GetSettingGeneral();





$rootScope.ProductCount = function(collectionName,pageName){
	var count = 0;
	angular.forEach($scope.ListProduct, function (product) {
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
	console.log(redirect);
	$rootScope.User.info = {};
	$rootScope.User.info.CustomerEmail = $scope.GuestEmail;
	$rootScope.User.info.CustomerFirstName = $scope.GuestFirstName;
	$rootScope.User.info.CustomerLastName = $scope.GuestLastName;
	$rootScope.SetLocalStorage('User');
	top.location.href = "/"+redirect;
}
//Add to cart
$rootScope.addToCart = function(productID,productInfo){	
	//console.log(productInfo);

	var count = 1;
	$scope.varientSelected = productInfo.productVarientModel;
	var varient = productInfo.productVarientModel;
	var quantity = parseInt(productInfo.productQuantity);
	var totalCounts = 0;
		
	$.each($scope.varientSelected,function(ind,itm){
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
		$.each($scope.varientSelected,function(index, item) {
	    //console.log($scope.varientSelected);
	 	var varientItem = $scope.varientSelected[index];
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
			console.log($rootScope.Cart);
			
			
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
}
$rootScope.IfCart= function(){	
	var length= 0;
	$.each($rootScope.Cart,function(index,item){
		console.log('-----bda=========');
		console.log(item);
		console.log(item.productID);
		console.log(item.productID);
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
		console.log(Productid);	
		delete $rootScope.Cart[Productid];
	}
	$rootScope.SetLocalStorage('Cart');
}
$rootScope.SetLocalStorage= function(Index){
	if(Index == 'Cart' || Index == ''){
		window.localStorage.setItem('Cart',JSON.stringify($rootScope.Cart));
		console.log(window.localStorage.getItem('Cart'));
	}
	if(Index == 'User' || Index == ''){
		window.localStorage.setItem('User',JSON.stringify($rootScope.User.info));
		console.log(window.localStorage.getItem('User'));
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
			console.log($rootScope.User);
		}
	}
}
$rootScope.GetLocalStorage('');

$rootScope.CheckLogin = function(redirect){
	$('#error').hide();
	AzureMobileClient.getFilterData($scope.CustomerTable,{CustomerEmail:$rootScope.Customer.email,CustomerPassword:$rootScope.Customer.password}).then(
		function(data) {
			//console.log(data);
			if(data.length > 0){
				$rootScope.User.info = {};
				$rootScope.User.info = data[0];
				$rootScope.Customer = data[0];
				$rootScope.SetLocalStorage('User');
				$scope.$apply(function() { 
					if(redirect == 'window.history.back()'){
						window.history.back();
					}else{
						top.location.href = "/"+redirect;
					}
				});
				
			}else{
				$('#error').show();
			}
	});
}

$rootScope.SignUp = function(redirect){
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
		AzureMobileClient.addData($scope.CustomerTable, NewUser).then(
			function(UserData) {
			   //console.log(UserData);
			   $rootScope.User.info = UserData;
			   $rootScope.SetLocalStorage('User');
			   $scope.$apply(function() { 
			   		if(redirect == 'window.history.back()'){
						window.history.back();
					}else{
						$location.path("/"+redirect);
					}
			   		 
				});
			},
			function(error) {
				console.log("An error has occurred: " + error.message);
			});
}
$rootScope.Logout = function(){
	delete $rootScope.User.info;
	window.localStorage.removeItem('User');
}

$rootScope.SubmitOrder =  function(payment,redirect){
	if($rootScope.User.info.CustomerEmail == 'guest@fishry.com'){
		$.each($rootScope.Customer,function(index,item){
			$rootScope.User.info[index] = item;
		})
		//$rootScope.User.info.Country = $rootScope.Customer.Country;
	}
		var NewOrder = {
							userInfo: JSON.stringify($rootScope.User.info),
							paymentInfo: payment,
							productInfo: JSON.stringify($rootScope.Cart),
						}
		AzureMobileClient.addData($scope.OrderTable, NewOrder).then(
			function(OrderData) {
			   $rootScope.OrderInfo = OrderData;
			   $rootScope.Cart = {};
			   $rootScope.SetLocalStorage('Cart');
			   $scope.$apply(function() {
				   if(redirect == 'window.history.back()'){
						window.history.back();
					}else{
						$location.path(redirect);
					}
				   	 
			   });
			},
			function(error) {
				console.log("An error has occurred: " + error.message);
			});
}

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

