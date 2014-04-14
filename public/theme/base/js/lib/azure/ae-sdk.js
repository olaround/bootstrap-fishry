// JavaScript Document
function AECtrl ($scope, $location,AzureMobileClient,$rootScope,$routeParams,$cookies) {
	//console.log($routeParams);
	$rootScope.$location = $location;	
	$rootScope.Cart = {};
	$rootScope.User = {};
	$rootScope.User.info = {};
	$rootScope.isCollapsed = true;
	$rootScope.OrderInfo = true;
	
	$rootScope.Customer = {};
	$rootScope.ErrorLogin = false;
	//console.log($scope.locationParam);
		
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

//Main Scopes Names	
	$scope.ListCollection = {};
	$scope.ListProduct = {};
	$scope.ListProductType = {};
	$scope.ListProductVendor = {};
	$scope.ListPage = {};
	$scope.ListNavigation = {};
	$scope.ListPaymentGateways = {};
	$scope.ListPaymentMethod = {};
	
//Get Collections		
$scope.GetCollection = function(param){
		AzureMobileClient.getFilterData($scope.CollectionTable,{}).then(
			function(data) {
				$scope.ListCollection = data;
				$scope.GetPaymentGateways();
		});
	
};
$scope.GetPaymentGateways = function(param){
		AzureMobileClient.getFilterData($scope.PaymentGatewaysTable,{}).then(
			function(data) {
				$scope.ListPaymentGateways = data;
				$.each($scope.ListPaymentGateways ,function(index,item){
					$scope.ListPaymentGateways[index].payment_method = JSON.parse($scope.ListPaymentGateways[index].payment_method);
					$scope.ListPaymentMethod= $scope.ListPaymentGateways[index].payment_method;
				});
				console.log($scope.ListPaymentMethod);
				$scope.GetNavigation();
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
				$scope.GetPage();
		});
	
};
$scope.GetPage = function(param){
		AzureMobileClient.getFilterData($scope.PageTable,{}).then(
			function(data) {
				$scope.ListPage = data;
				$scope.GetProductType();
		});
	
};
//Get Products Type		
$scope.GetProductType = function(param){
	AzureMobileClient.getFilterData($scope.ProductTypeTable,{}).then(
		function(data) {
			$scope.ListProductType = data;
			$scope.GetProductVendor();
	});
};

//Get Products Vendors		
$scope.GetProductVendor = function(param){
	AzureMobileClient.getFilterData($scope.ProductVendorTable,{}).then(
		function(data) {
			$scope.ListProductVendor = data;
			$scope.GetProduct();
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
		   });
			console.log($scope.ListProduct);
			$scope.$apply(function(){
				$('#Loader').hide();
			});
	});
};
$scope.GetCollection();



//Add to cart
$rootScope.addToCart = function(productID,productInfo){	
	var quantity = 1;
	if(!$rootScope.Cart[productID]){
		$rootScope.Cart[productID] = {productID:productID,quantity:quantity,productInfo:productInfo};
	}else{
		$rootScope.Cart[productID].quantity = parseInt($rootScope.Cart[productID].quantity) + 1;
		console.log($rootScope.Cart);
	}
	$rootScope.SetLocalStorage('Cart');
}
$rootScope.IfCart= function(){	
	var length= 0;
	$.each($rootScope.Cart,function(item){
		length++
	});
	if(length == 0){
		return false;
	}else{
		return true;
	}
}
$rootScope.ReturnItems= function(){	
	var length= 0;
	$.each($rootScope.Cart,function(item){
		length++
	});
		return length;
}
$rootScope.ReturnTotal= function(){	
	var Amount= 0;
	$.each($rootScope.Cart,function(index,item){
		Amount += item.productInfo.productPrice * item.quantity ;
	});
	
	return Amount;
	
}
$rootScope.RemoveCartItem= function(id){
	console.log(id);	
	delete $rootScope.Cart[id];
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
			console.log($rootScope.User);
		}
	}
}
$rootScope.GetLocalStorage('');

$rootScope.CheckLogin = function(redirect){
	$('#error').hide();
	AzureMobileClient.getFilterData($scope.CustomerTable,{CustomerEmail:$rootScope.Customer.email,CustomerPassword:$rootScope.Customer.password}).then(
		function(data) {
			if(data.length > 0){
				$rootScope.User.info = {};
				$rootScope.User.info = data[0];
				$rootScope.SetLocalStorage('User');
				 $scope.$apply(function() { top.location.href = "/"+redirect; });
				
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
		AzureMobileClient.addData($scope.CustomerTable, NewUser).then(
			function(UserData) {
			   $rootScope.User.info = UserData;
			   $rootScope.SetLocalStorage('User');
			   $scope.$apply(function() { $location.path("/"+redirect); });
			},
			function(error) {
				console.log("An error has occurred: " + error.message);
			});
}
$rootScope.Logout = function(){
	delete $rootScope.User.info;
	window.localStorage.removeItem('User');
}

$rootScope.SubmitOrder =  function(){
		var NewOrder = {
							userInfo: JSON.stringify($rootScope.User.info),
							paymentInfo: $('#PaymentMethod').val(),
							productInfo: JSON.stringify($rootScope.Cart),
						}
		AzureMobileClient.addData($scope.OrderTable, NewOrder).then(
			function(OrderData) {
			   $rootScope.OrderInfo = OrderData;
			   $rootScope.Cart = {};
			   $rootScope.SetLocalStorage('Cart');
			   $scope.$apply(function() { $location.path("/thankyou"); });
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

