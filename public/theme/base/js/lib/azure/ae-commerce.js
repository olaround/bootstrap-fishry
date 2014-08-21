aeCommerce.factory('AECommerce', ['$cookieStore','$resource', '$rootScope', function ($scope,$cookieStore, $rootScope,$resource,AzureMobileClient) {
  $scope.CollectionTable = 'collection';
  var AECommerce = {};
  
  // Login to Azure method. Takes a string (socialMediaService) with the social media service being used (Facebook, Twitter, etc.)
  // Returns a boolean value indicating success or failure
	 AECommerce.GetCollection = function(param){
		return AzureMobileClient.getFilterData($scope.CollectionTable,{}).then(
			function(data) {
				return data;
		});
	};
  return AECommerce;
}]);