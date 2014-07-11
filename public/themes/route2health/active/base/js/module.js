var aeCommerce = angular.module('aeCommerce', ['ngCookies','ngResource','ui.bootstrap','ngSanitize','App.filters','compile'])
	.config(aeCommerceRouter);

function aeCommerceRouter ($routeProvider,$locationProvider,$provide,$compileProvider) {
	console.log($routeProvider);
	$routeProvider
		.when('/', {
			templateUrl: BaseUrl+'partials/home.html',
			controller: 'HomeCtrl',
			title : unescape(seoTitle),
		 })
		 .when('/collections', {
			templateUrl: BaseUrl+'partials/collections.html',
			controller: 'CollectionCtrl',
			title : unescape(seoTitle),
		 })
		 .when('/collections/:CollectionName', {
			templateUrl: BaseUrl+'partials/collections.html',
			controller: 'CollectionCtrl',
			title : unescape(seoTitle), 
		 })
		 .when('/products/:ProductSlug', {
			templateUrl: BaseUrl+'partials/product.html',
			controller: 'ProductCtrl',
			title : unescape(seoTitle),
		 })
		 .when('/products', {
			templateUrl: BaseUrl+'partials/product.html',
			controller: 'ProductCtrl',
			title : unescape(seoTitle),
		 })
		 .when('/product/:ProductSlug', {
			templateUrl: BaseUrl+'partials/product.html',
			controller: 'ProductCtrl',
			title : unescape(seoTitle),
		 })
		 .when('/product', {
			templateUrl: BaseUrl+'partials/product.html',
			controller: 'ProductCtrl',
			title : unescape(seoTitle),
		 })
		 .when('/cart', {
			templateUrl: BaseUrl+'partials/cart.html',
			controller: '',
			title : unescape(seoTitle),
		 })
		 .when('/confirm', {
			templateUrl: BaseUrl+'partials/confirm.html',
			controller: '',
			title : unescape(seoTitle),
		 })
		  .when('/search', {
			templateUrl: BaseUrl+'partials/search.html',
			controller: 'SearchCtrl',
			title : unescape(seoTitle),
		 })
		 .when('/thankyou', {
			templateUrl: BaseUrl+'partials/thankyou.html',
			controller: '',
			title : unescape(seoTitle),
		 })
		 .when('/login', {
			templateUrl: BaseUrl+'partials/login.html',
			controller: 'LoginCtrl',
			title : unescape(seoTitle),
		 })
		 .when('/forgot_password', {
			templateUrl: BaseUrl+'partials/forgot_password.html',
			controller: 'ForgotCtrl',
			title : unescape(seoTitle),
		 })
		 .when('/reset_password', {
			templateUrl: BaseUrl+'partials/reset_password.html',
			controller: 'ResetCtrl',
			title : unescape(seoTitle),
		 })
		  .when('/account_info', {
			templateUrl: BaseUrl+'partials/account_info.html',
			controller: 'AccountCtrl',
			title : unescape(seoTitle),
		 })
		  .when('/orders', {
			templateUrl: BaseUrl+'partials/orders.html',
			controller: 'OrdersCtrl',
			title : unescape(seoTitle),
		 })
		 .when('/signup', {
			templateUrl: BaseUrl+'partials/signup.html',
			controller: 'SignupCtrl',
			title : unescape(seoTitle),
		 })
		 .when('/page/askdoctor', {
			templateUrl: BaseUrl+'partials/askdoctor.html',
			controller: 'PageCtrl',
			title : unescape(seoTitle),
		 })
		 .when('/page/:PageUrl', {
			templateUrl: BaseUrl+'partials/page.html',
			controller: 'PageCtrl',
			title : unescape(seoTitle),
		 })
		 .when('/:any', {
			templateUrl: BaseUrl+'partials/404.html',
			controller: '',
			title : unescape(seoTitle),
		 });
		 $locationProvider.html5Mode(true).hashPrefix('navigate');	
		 	 	 
}

aeCommerce.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		$rootScope.cartHandler = false;
		$('#mobilelink').slideUp(500,'linear');
		var addedTitle = '';
		if(current.params.CollectionName){
			addedTitle = ' | '+current.params.CollectionName;
		}
		if(current.params.ProductSlug){
			addedTitle = ' | '+current.params.ProductSlug;
		}
		console.log(current);
        $rootScope.title = current.$$route.title + addedTitle;
    });
	
}]);

aeCommerce.directive('dynamicTooltip', function($compile) {
    return {
      restrict: 'A',
      scope: {
        tooltipElement: '=',
        dynamicTooltip: '@'
      },
      link: function(scope, element, attrs) {
        var template = '<a href="#" tooltip-placement="top" tooltip="' + scope.dynamicTooltip + '">{{tooltipElement}}</a>';
        scope.$watch('tooltipElement', function(value) {
          var previousTooltip = element.find('a');
          angular.forEach(previousTooltip, function(item, i) {
            var el = angular.element(item);
            el.replaceWith(el.text());
          });
          var searchText = scope.tooltipElement;
          if (searchText) {
            replaced = element.html().replace(new RegExp(searchText, "g"), template);
            element.html(replaced);
          }
          $compile(element.contents())(scope);
        });
      }
    }
  })
aeCommerce.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 				$('#searchPageLink').click();
                event.preventDefault();
            }
        });
    };
});
aeCommerce.filter('nfcurrency', ['$filter', '$locale',
    function($filter, $locale) {
        var currency = $filter('currency'),
            formats = $locale.NUMBER_FORMATS;
        return function(amount, symbol) {
            var value = currency(amount, symbol);
            return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '')
        }
    }
]);
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
