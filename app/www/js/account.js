souq

.controller('AccountCtrl', function ($scope, $ionicModal, $http, $crypto, $ionicPopup, $interval, userAuth, $ionicLoading, fullModeFactory) {

  $scope.mode = localStorage.getItem('mode');
  console.log($scope.mode);

  if($scope.mode == null)
    $scope.mode = 'lite';

  $scope.liteClass = '';
  $scope.fullClass = 'button-outline';
  $scope.lite = true;

  
  $scope.switch = function(type) 
  {
    $scope.mode = type;
    if(type == 'lite')
    {
      $scope.lite = true;
      $scope.liteClass = '';
      $scope.fullClass = 'button-outline';
    }
    else if(type == 'full')
    {
      $scope.lite = false;
      $scope.fullClass = '';
      $scope.liteClass = 'button-outline';
    }
  }


  $scope.checkSettings = function() 
  {
    var serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
    if(serverSettings != null)
      return;

    var confirmPopup = $ionicPopup.confirm({
      title: 'No server settings found!!',
      template: 'Please setup your server settings'
    });

    confirmPopup.then(function(res) {
      if(res) 
      {
        $ionicModal.fromTemplateUrl('templates/serverSettingsModal.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.switch('lite');
          $scope.modal = modal;
          $scope.modal.show();
        });
      } 
      else {
        console.log('You are not sure');
      }
    });
  }

  if($scope.mode == 'full')
  {
    $scope.switch('full');
    $scope.checkSettings();

    fullModeFactory.getProjects().then(function(res){
      console.log(res);
      $scope.owned = res;
    });;
    
    fullModeFactory.getDetails().then(function(res){
      console.log(res);
      $scope.deposit = res.deposit;
      $scope.balance = res.balance;
    });
  }

  $scope.saveLocation = function(locationData){      
  	locationData.device = $crypto.encrypt(locationData.device.toString());
  	locationData.latitude = $crypto.encrypt(locationData.latitude);
  	locationData.longitude = $crypto.encrypt(locationData.longitude);
  	localStorage.setItem('location', JSON.stringify(locationData)) ;
  	showAlert('Your location settings are successfully updated');
  }

  $scope.saveServerSettings = function(serverData)
  {
    console.log(serverData);
    localStorage.setItem('mode', $scope.mode);

  	if(serverData.serverType == undefined)   
  		serverData.serverType = $crypto.encrypt("true");
  	else
  		serverData.serverType = $crypto.encrypt(serverData.serverType.toString());

    if(serverData.serverTypeLite == undefined)   
      serverData.serverTypeLite = $crypto.encrypt("true");
    else
      serverData.serverTypeLite = $crypto.encrypt(serverData.serverTypeLite.toString());

  	serverData.host = $crypto.encrypt(serverData.host);
  	serverData.port = $crypto.encrypt(serverData.port);
  	serverData.password = $crypto.encrypt(serverData.password);
    serverData.publicGateway = $crypto.encrypt(serverData.publicGateway);

  	localStorage.setItem('serverSettings', JSON.stringify(serverData));
  	showAlert('Your server settings are successfully updated');
  }

  $scope.reSync = function(){
  
    fullModeFactory.getRecacheToken().then(function(res){
      console.log(res.token);
      fullModeFactory.postRecacheToken(res.token).then(function(res) {
        console.log(res);
      })
    });
  }

  $scope.openModal = function(id)
  {   
    $scope.mode = localStorage.getItem('mode');  
    if($scope.mode == null)
      $scope.mode = 'lite';
    console.log($scope.mode);
    $scope.switch($scope.mode); 

  	if(id == 1)
  	{                
  		$ionicModal.fromTemplateUrl('templates/locationModal.html', {
  			scope: $scope,
  			animation: 'slide-in-up'
  		}).then(function(modal) {
  			
        $scope.modal = modal;
  			$scope.modal.show();
  			
        let encrypted = JSON.parse(localStorage.getItem('location'));

        if(encrypted == null)
          return;

  			var decrypted = {
          device: $crypto.decrypt(encrypted.device),
          latitude: $crypto.decrypt(encrypted.latitude), 
          longitude: $crypto.decrypt(encrypted.longitude)
        };

  			if(decrypted.device == "true"){
  				decrypted.device = true;
  			}
  			else{
  				decrypted.device = false;
  			}

  			$scope.location = decrypted;
  		});        
  	}
  	else if(id == 2)
  	{
  		$ionicModal.fromTemplateUrl('templates/serverSettingsModal.html', {
  			scope: $scope
  		}).then(function (modal) {
  			$scope.modal = modal;
  			$scope.modal.show();

        var encrypted = JSON.parse(localStorage.getItem('serverSettings'));
        
        if(encrypted == null)
          return;

  			var decrypted = {
          serverType: $crypto.decrypt(encrypted.serverType), 
          host: $crypto.decrypt(encrypted.host), 
          port: $crypto.decrypt(encrypted.port), 
          password: $crypto.decrypt(encrypted.password),
          publicGateway: $crypto.decrypt(encrypted.publicGateway),
          serverTypeLite: $crypto.decrypt(encrypted.serverTypeLite),
          username: ''
        };
  			
        if(decrypted.serverType == "true")
  				decrypted.serverType = "true";
  			else
  				decrypted.serverType = "false";
  		
  			$scope.serverSettings = decrypted;
  		});          
  	}    
  }

  $scope.logout = function(){
  	userAuth.userLogout();
  }

  $scope.$on('$destroy', function() {
  	console.log('destroy');
  	$interval.cancel($scope.interval);
  });

  showAlert = function(template) {
    $ionicPopup.alert({
      title: 'Save',
      template: template,
      buttons: [{
        text:'OK',
        onTap: function(e) {
          $scope.modal.hide();
          if($scope.mode == 'full')
          {
            fullModeFactory.getDetails().then(function(res){
              $scope.deposit = res.deposit;
              $scope.balance = res.balance;
            });
          }
        }
      }]
    });
  }
})
