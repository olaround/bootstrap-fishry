var aeCommerce = angular.module('aeCommerce', ['ngCookies','ngResource','ui.bootstrap','ngSanitize','App.filters','compile'])
	.config(aeCommerceRouter);

function aeCommerceRouter ($routeProvider,$locationProvider,$provide,$compileProvider) {
	console.log($routeProvider);
	$routeProvider
		.when('/', {
			templateUrl: BaseUrl+'partials/home.html',
			controller: 'HomeCtrl',
			title : storeNameMeta,
		 })
		.when('/home1', {
			templateUrl: BaseUrl+'partials/home1.html',
			controller: 'HomeCtrl',
			title : storeNameMeta,
		 })
		.when('/home2', {
			templateUrl: BaseUrl+'partials/home2.html',
			controller: 'HomeCtrl',
			title : storeNameMeta,
		 })
		.when('/home3', {
			templateUrl: BaseUrl+'partials/home3.html',
			controller: 'HomeCtrl',
			title : storeNameMeta,
		 })
		.when('/home4', {
			templateUrl: BaseUrl+'partials/home4.html',
			controller: 'HomeCtrl',
			title : storeNameMeta,
		 })
		 .when('/collections', {
			templateUrl: BaseUrl+'partials/collections.html',
			controller: 'CollectionCtrl',
			title : storeNameMeta,
		 })
		 .when('/collections/:CollectionName', {
			templateUrl: BaseUrl+'partials/collections.html',
			controller: 'CollectionCtrl',
			title : storeNameMeta, 
		 })
		 .when('/products/:ProductSlug', {
			templateUrl: BaseUrl+'partials/product.html',
			controller: 'ProductCtrl',
			title : storeNameMeta,
		 })
		 .when('/products', {
			templateUrl: BaseUrl+'partials/product.html',
			controller: 'ProductCtrl',
			title : storeNameMeta,
		 })
		 .when('/product/:ProductSlug', {
			templateUrl: BaseUrl+'partials/product.html',
			controller: 'ProductCtrl',
			title : storeNameMeta,
		 })
		 .when('/product', {
			templateUrl: BaseUrl+'partials/product.html',
			controller: 'ProductCtrl',
			title : storeNameMeta,
		 })
		 .when('/cart', {
			templateUrl: BaseUrl+'partials/cart.html',
			controller: '',
			title : 'Cart - '+storeNameMeta,
		 })
		 .when('/confirm', {
			templateUrl: BaseUrl+'partials/confirm.html',
			controller: '',
			title : 'Confirm Order - '+storeNameMeta,
		 })
		  .when('/search', {
			templateUrl: BaseUrl+'partials/search.html',
			controller: 'SearchCtrl',
			title : 'Search - '+storeNameMeta,
		 })
		 .when('/thankyou', {
			templateUrl: BaseUrl+'partials/thankyou.html',
			controller: '',
			title : storeNameMeta+ ' | Thankyou'
		 })
		 .when('/login', {
			templateUrl: BaseUrl+'partials/login.html',
			controller: 'LoginCtrl',
			title : 'Login - '+storeNameMeta,
		 })
		 .when('/forgot_password', {
			templateUrl: BaseUrl+'partials/forgot_password.html',
			controller: 'ForgotCtrl',
			title : 'Forgot Password - '+storeNameMeta,
		 })
		 .when('/reset_password', {
			templateUrl: BaseUrl+'partials/reset_password.html',
			controller: 'ResetCtrl',
			title : 'Reset Password - '+storeNameMeta,
		 })
		 .when('/reset_password/:id', {
			templateUrl: BaseUrl+'partials/reset_password.html',
			controller: 'ResetCtrl',
			title : 'Reset Password - '+storeNameMeta,
		 })
		  .when('/account_info', {
			templateUrl: BaseUrl+'partials/account_info.html',
			controller: 'AccountCtrl',
			title : storeNameMeta+ ' | Login'
		 })
		  .when('/orders', {
			templateUrl: BaseUrl+'partials/orders.html',
			controller: 'OrdersCtrl',
			title : 'Orders - '+storeNameMeta,
		 })
		 .when('/signup', {
			templateUrl: BaseUrl+'partials/signup.html',
			controller: 'SignupCtrl',
			title : 'Signup - '+storeNameMeta,
		 })
		 .when('/page/:PageUrl', {
			templateUrl: BaseUrl+'partials/page.html',
			controller: 'PageCtrl',
			title : storeNameMeta,
		 })
		 .when('/:any', {
			templateUrl: BaseUrl+'partials/404.html',
			controller: '',
			title : '404 Not Found - '+storeNameMeta,
		 });
		 $locationProvider.html5Mode(true).hashPrefix('navigate');	
		 	 	 
}

aeCommerce.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		var addedTitle = '';
		if(current.params.CollectionName){
			addedTitle = current.params.CollectionName+' - ';
		}
		if(current.params.ProductSlug){
			addedTitle = current.params.ProductSlug+' - ';
		}
		console.log(current);
        $rootScope.title =  addedTitle + current.$$route.title;
    });
	
}]);

aeCommerce.directive('bootCarousel', function(){
    return function(scope, elem, attrs) {
        scope.carouselPrev = function(){
            jQuery('#'+attrs.id).carousel('prev');
        }

        scope.carouselNext = function(){
            $('#'+attrs.id).carousel('next');   
        }
    }
});
aeCommerce.directive('tagInput', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			scope.inputWidth = 20;

			// Watch for changes in text field
			scope.$watch(attrs.ngModel, function(value) {
				if (value != undefined) {
					var tempEl = $('<span>' + value + '</span>').appendTo('body');
					scope.inputWidth = tempEl.width() + 5;
					tempEl.remove();
				}
			});

			element.bind('keydown', function(e) {
			console.log(e.which);
				if (e.which == 9) {
					e.preventDefault();
				}

				if (e.which == 8) {
					scope.$apply(attrs.deleteTag);
				}
			});

			element.bind('keyup', function(e) {
				var key = e.which;

				// Tab or Enter pressed 
				if (key == 188) {
					e.preventDefault();
					scope.$apply(attrs.newTag);
				}
			});
		}
	}
});

 var compile = angular.module('compile', [], function($compileProvider) {
	$compileProvider.directive('compile', function($compile) {
      // directive factory creates a link function
      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
             // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile);
          },
          function(value) {
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(value);

            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
            $compile(element.contents())(scope);
          }
        );
      };
    })
});
angular.module('plunker', ['ui.bootstrap']);
var ModalDemoCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

angular.module('ng').filter('cut', function() {
    return function(value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});