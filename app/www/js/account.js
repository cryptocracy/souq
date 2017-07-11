souq

.controller('AccountCtrl', function ($scope, $ionicModal, $http, $crypto, $ionicPopup, $interval, userAuth, $ionicLoading) {
    
    $scope.interval;
    $scope.getDetails = function() {
      $scope.serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
      if ($scope.serverSettings != undefined) {
        $ionicLoading.show();
        var header = {
          "alg": "HS256",
          "typ": "JWT"
        };
        var stringifiedHeader = $crypto.parseData(header);
        var encodedHeader = $crypto.base64url(stringifiedHeader);

        var payload = {
          "method": "get",
          "request": "deposit",
          "admin": true
        };
        var stringifiedPayload = $crypto.parseData(payload);
        var encodedPayload = $crypto.base64url(stringifiedPayload);
        
        let encrypted = JSON.parse(localStorage.getItem('serverSettings'));
        let decrypted = {serverType:'', host:'', port:'', username: '', password: ''};
        
        decrypted.serverType  = $crypto.decrypt(encrypted.serverType);
          if(decrypted.serverType == "true")
            decrypted.serverType = 'http';
          else
            decrypted.serverType = 'https';
          
        decrypted.host  = $crypto.decrypt(encrypted.host);
        decrypted.port  = $crypto.decrypt(encrypted.port);
        //decrypted.username  = $crypto.decrypt(encrypted.username);
        decrypted.password  = $crypto.decrypt(encrypted.password);
        
        $scope.serverSettings = decrypted;

        var token = encodedHeader + "." + encodedPayload;
        token = $crypto.encryptHMA(token, decrypted.password);
        token = $crypto.base64url(token);
        
        // var urlDeposit = decrypted.serverType + '://' + decrypted.host + ':' + decrypted.port + '/get?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;
        var urlDeposit = decrypted.serverType + '://' + decrypted.host + ':' + decrypted.port + '/get?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;
        console.log(urlDeposit);
        var payload = {
          "method": "get",
          "request": "balance",
          "admin": true
        };
        var stringifiedPayload = $crypto.parseData(payload);
        var encodedPayload = $crypto.base64url(stringifiedPayload);

        var token = encodedHeader + "." + encodedPayload;
        token = $crypto.encryptHMA(token, decrypted.password);
        token = $crypto.base64url(token);

        // var urlBalance = decrypted.serverType + '://' + decrypted.host + ':' + decrypted.port + '/get?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;
        var urlBalance = decrypted.serverType + '://' + decrypted.host + ':' + decrypted.port + '/get?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;
        console.log(urlBalance);

        $scope.deposit = "";
        $scope.balance = "";

        $http.get(urlDeposit)
          .success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
            console.log('data success deposit');
            console.log(data);
            $scope.deposit = data;
          })
          .error(function(data, status, headers, config){
            console.log('data error');
            $ionicLoading.hide();
            $interval.cancel($scope.interval);
            $ionicPopup.alert({
              title: 'Error',
              template: "Can't Connect, Please Check Settings Or Server and Try Again",
              buttons: [{
                text:'OK'
              }]
            });
          });

        $http.get(urlBalance)
          .success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
            console.log('data sucess balance');
            console.log(data);
            $scope.balance = data;
            $ionicLoading.hide();
          })
          .error(function(data, status, headers, config){
            console.log('data error');
            $interval.cancel($scope.interval);
            $ionicLoading.hide();
          });
      }
      else {
        var confirmPopup = $ionicPopup.confirm({
          title: 'No server settings found!!',
          template: 'Please setup your server settings'
        });

        confirmPopup.then(function(res) {
          if(res) {
            $ionicModal.fromTemplateUrl('templates/serverSettingsModal.html', {
              scope: $scope
            }).then(function (modal) {
              $scope.modal = modal;
              $scope.modal.show();
            });
          } 
          else {
            console.log('You are not sure');
          }
        });
      }
    }


   $scope.getProjects = function() {
      $scope.serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
      if ($scope.serverSettings != undefined) {
        $ionicLoading.show();
        var header = {
          "alg": "HS256",
          "typ": "JWT"
        };
        var stringifiedHeader = $crypto.parseData(header);
        var encodedHeader = $crypto.base64url(stringifiedHeader);

        var payload = {
          "method": "get",
          "request": "owned",
          "admin": true
        };
        var stringifiedPayload = $crypto.parseData(payload);
        var encodedPayload = $crypto.base64url(stringifiedPayload);
        
        let encrypted = JSON.parse(localStorage.getItem('serverSettings'));
        let decrypted = {serverType:'', host:'', port:'', username: '', password: ''};
        
        decrypted.serverType  = $crypto.decrypt(encrypted.serverType);
          if(decrypted.serverType == "true")
            decrypted.serverType = 'http';
          else
            decrypted.serverType = 'https';
          
        decrypted.host  = $crypto.decrypt(encrypted.host);
        decrypted.port  = $crypto.decrypt(encrypted.port);
        decrypted.password  = $crypto.decrypt(encrypted.password);
        
        $scope.serverSettings = decrypted;

        var token = encodedHeader + "." + encodedPayload;
        token = $crypto.encryptHMA(token, decrypted.password);
        token = $crypto.base64url(token);
        
        var urlOwned = decrypted.serverType + '://' + decrypted.host + ':' + decrypted.port + '/get?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;
        $scope.owned = "";

        $http.get(urlOwned, {timeout: 10000})
          .success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
            console.log('data sucess urlOwned');
            console.log(data);
            $scope.owned = data;
            $ionicLoading.hide();
          })
          .error(function(data, status, headers, config){
            console.log('data error urlOwned');
            $ionicLoading.hide();
            $interval.cancel($scope.interval);
            $ionicPopup.alert({
              title: 'Error',
              template: "Can't Connect, Please Check Settings Or Server and Try Again",
              buttons: [{
                text:'OK'
              }]
            });
          });
      }
    }


    $scope.getProjects();


    $scope.serverSettings = JSON.parse(localStorage.getItem('serverSettings'));

    if ($scope.serverSettings == undefined) {
      $scope.getDetails();  
    }
    else if ($scope.serverSettings != undefined) {
      $scope.getDetails();
    }

    $scope.dataSaveAlert = function(){    
      $ionicPopup.alert({
        title: 'Save',
        template: 'Successfully Updated!',
        buttons: [{
          text:'OK',
          onTap: function(e) {
            $scope.modal.hide();
            $scope.getDetails();
          }
        }]
      });
    };
    
    $scope.saveLocation = function(locationData){      
      locationData.device = $crypto.encrypt(locationData.device.toString());
      locationData.latitude = $crypto.encrypt(locationData.latitude);
      locationData.longitude = $crypto.encrypt(locationData.longitude);
      localStorage.setItem('location', JSON.stringify(locationData)) ;
      $scope.dataSaveAlert();
    }

    $scope.saveServerSettings = function(serverData){
      if(serverData.serverType == undefined)   
        serverData.serverType = $crypto.encrypt("true");
      else
        serverData.serverType = $crypto.encrypt(serverData.serverType.toString());
      
      serverData.host = $crypto.encrypt(serverData.host);
      serverData.port = $crypto.encrypt(serverData.port);
      serverData.password = $crypto.encrypt(serverData.password);      
      localStorage.setItem('serverSettings', JSON.stringify(serverData));
      $scope.dataSaveAlert();
    }

    $scope.openModal = function(id){      
      if(id == 1)
      {                
        $ionicModal.fromTemplateUrl('templates/locationModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {                  
          $scope.modal = modal;
          $scope.modal.show();
          let encrypted;
          let decrypted = { device: '', latitude:'', longitude:''};
          encrypted = JSON.parse(localStorage.getItem('location'));
          decrypted.device  = $crypto.decrypt(encrypted.device);
          if(decrypted.device == "true"){
            decrypted.device = true;
          }
          else{
            decrypted.device = false;
          }
          decrypted.latitude  = $crypto.decrypt(encrypted.latitude);            
          decrypted.longitude  = $crypto.decrypt(encrypted.longitude);            
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
          var decrypted = {serverType:'', host:'', port:'', username: '', password: ''};
          encrypted = JSON.parse(localStorage.getItem('serverSettings'));
          if(encrypted == null)
            return;

          decrypted.serverType  = $crypto.decrypt(encrypted.serverType);
          if(decrypted.serverType == "true"){
            decrypted.serverType = "true";
          }
          else{
            decrypted.serverType = "false";
          }
          decrypted.host  = $crypto.decrypt(encrypted.host);
          decrypted.port  = $crypto.decrypt(encrypted.port);
          decrypted.password  = $crypto.decrypt(encrypted.password);
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

})
