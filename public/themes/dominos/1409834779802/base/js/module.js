var aeCommerce = angular.module('aeCommerce', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'App.filters','compile'])
    .config(aeCommerceRouter);

function aeCommerceRouter($routeProvider, $locationProvider, $provide) {
    $routeProvider
        .when('/', {templateUrl: BaseUrl + 'partials/home.html',controller: 'HomeCtrl',title : unescape(seoTitle),})
        .when('/collections/:CollectionName', {templateUrl: BaseUrl + 'partials/collections.html',controller: 'CollectionCtrl',title : unescape(seoTitle),})
        .when('/product/:ProductSlug', {templateUrl: BaseUrl + 'partials/product.html',controller: 'ProductCtrl',title : unescape(seoTitle),})
        .when('/products/:ProductSlug', {templateUrl: BaseUrl + 'partials/products.html',controller: 'ProductCtrl',title : unescape(seoTitle),})
        .when('/cart', {templateUrl: BaseUrl + 'partials/cart.html',controller: 'CartCtrl',title : unescape(seoTitle),})
        .when('/account_info', {templateUrl: BaseUrl+'partials/account_info.html',controller: 'AccountCtrl',title : unescape(seoTitle),})
        .when('/orders', {templateUrl: BaseUrl+'partials/orders.html',controller: 'OrdersCtrl',title : unescape(seoTitle),})
        .when('/confirm', {templateUrl: BaseUrl + 'partials/confirm.html',controller: 'ConfirmCtrl',title : unescape(seoTitle),})
        .when('/thankyou', {templateUrl: BaseUrl + 'partials/thankyou.html',controller: 'ThankyouCtrl',title : unescape(seoTitle),})
        .when('/login', {templateUrl: BaseUrl + 'partials/login.html',controller: 'LoginCtrl',title : unescape(seoTitle),})
        .when('/signup', {templateUrl: BaseUrl + 'partials/signup.html',controller: 'SignupCtrl',title : unescape(seoTitle),})
        .when('/page/order', {templateUrl: BaseUrl + 'partials/order.html',controller: 'OrderCtrl',title : unescape(seoTitle),})
        .when('/app', {templateUrl: BaseUrl + 'partials/app.html',controller: 'PageCtrl',title : "Dominos's Android App",})
        .when('/page/locations', {templateUrl: BaseUrl + 'partials/locations.html',controller: 'PageCtrl',title : unescape(seoTitle),})
        .when('/forgot_password', {templateUrl: BaseUrl+'partials/forgot_password.html',controller: 'ForgotCtrl',title : unescape(seoTitle),})
        .when('/reset_password', {templateUrl: BaseUrl+'partials/reset_password.html',controller: 'ResetCtrl',title : unescape(seoTitle),})
		 .when('/reset_password/:id', {templateUrl: BaseUrl+'partials/reset_password.html',controller: 'ResetCtrl',title : 'Reset Password - '+storeNameMeta,})
        .when('/page/:PageUrl', {templateUrl: BaseUrl + 'partials/page.html',controller: 'PageCtrl',title : unescape(seoTitle),})
        .when('/:any', {templateUrl: BaseUrl + 'partials/404.html',controller: '',title : unescape(seoTitle),});
    $locationProvider.html5Mode(true).hashPrefix('navigate');
}

aeCommerce.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		if($rootScope.setLocalStorageData){
			$rootScope.setLocalStorageData();
		}

        // ga('send', 'pageview', $location.path());
        ga('send', 'pageview', { page: $location.path() });
	});
    
}]);
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
aeCommerce.filter('nfcurrency', [ '$filter', '$locale', function ($filter, $locale) {
    var currency = $filter('currency'), formats = $locale.NUMBER_FORMATS;
    return function (amount, symbol) {
        var value = currency(amount, symbol);
        return value.replace(new RegExp('\\' + formats.DECIMAL_SEP + '\\d{2}'), '')
    }
}]);

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

 

