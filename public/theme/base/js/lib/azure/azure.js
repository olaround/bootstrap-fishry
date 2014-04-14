aeCommerce.factory('AzureMobileClient', ['$cookieStore','$resource', '$rootScope', function ($cookieStore, $rootScope,$resource) {

  var azureMobileClient = {};
  $rootScope.azureURL = 'https://ae-commerce.azure-mobile.net/';
  $rootScope.azureAppKey= 'rSgkHXqnUenpwSLUnbEjqpDEKoBZYA30';
  azureMobileClient.isLoggedIn = false;
  azureMobileClient.azureError = "";
  azureMobileClient.azureMSC = new WindowsAzure.MobileServiceClient($rootScope.azureURL, $rootScope.azureAppKey);
  azureMobileClient.storeID = "306628C1-65EB-46D4-B5FF-5195C4D4A1E1";
  
  // Login to Azure method. Takes a string (socialMediaService) with the social media service being used (Facebook, Twitter, etc.)
  // Returns a boolean value indicating success or failure
  azureMobileClient.login = function(socialMediaService) {
    return azureMobileClient.azureMSC.login(socialMediaService).then(
      function(user) {
        $cookieStore.put("azureUser", user);
      }
      );
  };

  // Logs out from the Azure service
  azureMobileClient.logout = function() {
    azureMobileClient.getUser();
    azureMobileClient.azureMSC.logout();
    $cookieStore.remove("azureUser");
  };

  // Get all data using the read method of the Azure service. Take a string (tableName) indicating the table to get data from
  azureMobileClient.getAllData = function(tableName) {
	var filter = {};
	filter.storeID = azureMobileClient.storeID;
    return azureMobileClient.prepService(tableName).where(filter).read();
  };
  azureMobileClient.getFilterData = function(tableName,filter) {
	filter.storeID = azureMobileClient.storeID;
    return azureMobileClient.prepService(tableName).where(filter).read();;
  };

  // Adds a data row (data) to the specified table (tableName). 
  // If success, returns the new object that was created.
  // If failure, returns the error text on failure.
  azureMobileClient.addData = function(tableName, data) {
	data.storeID = azureMobileClient.storeID;
    return azureMobileClient.prepService(tableName).insert(data);
  };

  azureMobileClient.updateData = function(tableName, data) {
	data.storeID = azureMobileClient.storeID;
    return azureMobileClient.prepService(tableName).update(data);
  };
  azureMobileClient.deleteData = function(tableName, data) {
	data.storeID = azureMobileClient.storeID;        
    return azureMobileClient.prepService(tableName).del(data);
  };

  // Gets the currentUser back from the cookieStore if the currentUser object is null
  azureMobileClient.getUser = function() {
    if (azureMobileClient.azureMSC.currentUser === null)
    {
      azureMobileClient.azureMSC.currentUser = $cookieStore.get("azureUser");
    }
  };

  // Sets the correct user and gets the appropriate table from Azure. Used in each call above to simplify methods
  azureMobileClient.prepService = function(tableName) {
    azureMobileClient.getUser();
    return azureMobileClient.azureMSC.getTable(tableName);
  };
  azureMobileClient.uploadImage = function(data,location) {
   	return $resource('/upload');
  };

  return azureMobileClient;
}]);