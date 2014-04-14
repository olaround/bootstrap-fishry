var aeCommerce = angular.module('aeCommerce', ['ngCookies','ngResource','ui.bootstrap','ngSanitize','App.filters'])
	.config(aeCommerceRouter);

function aeCommerceRouter ($routeProvider,$locationProvider,$provide) {
	$routeProvider
		.when('/', {
			templateUrl: './partials/home.html',
			controller: '',
			title : 'Home'
		 })
		 .when('/collections/:CollectionName', {
			templateUrl: './partials/collections.html',
			controller: 'CollectionCtrl',
			title : 'Collections'
		 })
		 .when('/product/:ProductName', {
			templateUrl: './partials/product.html',
			controller: 'ProductCtrl',
			title : 'Product'
		 })
		 .when('/cart', {
			templateUrl: './partials/cart.html',
			controller: '',
			title : 'Products'
		 })
		 .when('/confirm', {
			templateUrl: './partials/confirm.html',
			controller: '',
			title : 'Confirm Order'
		 })
		 .when('/thankyou', {
			templateUrl: './partials/thankyou.html',
			controller: '',
			title : 'Thankyou'
		 })
		 .when('/login', {
			templateUrl: './partials/login.html',
			controller: '',
			title : 'Login'
		 })
		 .when('/signup', {
			templateUrl: './partials/signup.html',
			controller: '',
			title : 'Signup'
		 })
		 .when('/page/order', {
			templateUrl: './partials/order.html',
			controller: 'PageCtrl',
			title : 'Order'
		 })
		 .when('/page/locations', {
			templateUrl: './partials/locations.html',
			controller: 'PageCtrl',
			title : 'Locations'
		 })
		 .when('/page/:PageUrl', {
			templateUrl: './partials/page.html',
			controller: 'PageCtrl',
			title : 'Page Any'
		 })
		 .when('/:any', {
			templateUrl: './partials/404.html',
			controller: '',
			title : 'Page Not Found'
		 });
		 $locationProvider.html5Mode(true).hashPrefix('navigate');		 
}

aeCommerce.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
	
}]);
