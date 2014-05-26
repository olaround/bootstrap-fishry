var aeCommerce = angular.module('aeCommerce', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ngSanitize', 'App.filters'])
    .config(aeCommerceRouter);

function aeCommerceRouter($routeProvider, $locationProvider, $provide) {
    $routeProvider
        .when('/', {
            templateUrl: BaseUrl + 'partials/home.html',
            controller: '',
            title: 'Home'
        })
        .when('/collections/:CollectionName', {
            templateUrl: BaseUrl + 'partials/collections.html',
            controller: 'CollectionCtrl',
            title: 'Collections'
        })
        .when('/product/:ProductName', {
            templateUrl: BaseUrl + 'partials/product.html',
            controller: 'ProductCtrl',
            title: 'Product'
        })
        .when('/products/:ProductName', {
            templateUrl: BaseUrl + 'partials/products.html',
            controller: 'ProductCtrl',
            title: 'Product'
        })
        .when('/cart', {
            templateUrl: BaseUrl + 'partials/cart.html',
            controller: 'OrderCtrl',
            title: 'Cart'
        })
        .when('/confirm', {
            templateUrl: BaseUrl + 'partials/confirm.html',
            controller: '',
            title: 'Confirm Order'
        })
        .when('/thankyou', {
            templateUrl: BaseUrl + 'partials/thankyou.html',
            controller: '',
            title: 'Thankyou'
        })
        .when('/login', {
            templateUrl: BaseUrl + 'partials/login.html',
            controller: '',
            title: 'Login'
        })
        .when('/signup', {
            templateUrl: BaseUrl + 'partials/signup.html',
            controller: '',
            title: 'Signup'
        })
        .when('/page/order', {
            templateUrl: BaseUrl + 'partials/order.html',
            controller: 'OrderCtrl',
            title: 'Order'
        })
        .when('/page/locations', {
            templateUrl: BaseUrl + 'partials/locations.html',
            controller: 'PageCtrl',
            title: 'Locations'
        })
        .when('/page/:PageUrl', {
            templateUrl: BaseUrl + 'partials/page.html',
            controller: 'PageCtrl',
            title: 'Page Any'
        })
        .when('/:any', {
            templateUrl: BaseUrl + 'partials/404.html',
            controller: '',
            title: 'Page Not Found'
        });
    $locationProvider.html5Mode(true).hashPrefix('navigate');
}

aeCommerce.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
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