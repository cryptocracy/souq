agora

.controller('AccountCtrl', function ($scope, $ionicModal, $http, $crypto, $ionicPopup, userAuth) {

    $scope.getDetails = function() {
      // body...
      $scope.serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
      if ($scope.serverSettings != undefined) 
      {
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
        
        var urlDeposit = decrypted.serverType + '://' + decrypted.host + ':' + decrypted.port + '/get/deposit?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;

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

        var urlBalance = decrypted.serverType + '://' + decrypted.host + ':' + decrypted.port + '/get/balance?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;

        $scope.deposit = "";
        $scope.balance = ""

        $http.get(urlDeposit)
          .success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
            console.log('data sucess');
            console.log(data);
            $scope.deposit = data;
          })
          .error(function(data, status, headers, config){
            console.log('data error');
          });

        $http.get(urlBalance)
          .success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
            console.log('data sucess');
            $scope.balance = data;
          })
          .error(function(data, status, headers, config){
            console.log('data error');
          });
      }
    }  

    $scope.getDetails();

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
          
      // console.log(locationData.device);
      locationData.device = $crypto.encrypt(locationData.device.toString());
      // console.log($crypto.encrypt(locationData.device));
      locationData.latitude = $crypto.encrypt(locationData.latitude);
      locationData.longitude = $crypto.encrypt(locationData.longitude);
      localStorage.setItem('location', JSON.stringify(locationData)) ;
      console.log("Location Saved");
      console.log(locationData);      
      $scope.dataSaveAlert();
      // $scope.hideToast();      
      
    }

    $scope.saveServerSettings = function(serverData){
      // var serverSettings = serverData;
      console.log(serverData);      
      serverData.serverType = $crypto.encrypt(serverData.serverType.toString());
      serverData.host = $crypto.encrypt(serverData.host);
      serverData.port = $crypto.encrypt(serverData.port);
      serverData.password = $crypto.encrypt(serverData.password);      
      localStorage.setItem('serverSettings', JSON.stringify(serverData));
      console.log("Server Settings Saved");
      console.log(serverData);
      $scope.dataSaveAlert();
    }

    $scope.openModal = function(id){      
      if(id == 1){                
        $ionicModal.fromTemplateUrl('templates/locationModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {                  

          //decyption
          $scope.modal = modal;
          $scope.modal.show();
          let encrypted;
          let decrypted = { device: '', latitude:'', longitude:''};
          // if($scope.location.latitude == "" || $scope.location.longitude == ""){
            encrypted = JSON.parse(localStorage.getItem('location'));
            // console.log(encrypted);
            decrypted.device  = $crypto.decrypt(encrypted.device);
            if(decrypted.device == "true"){
              decrypted.device = true;
              // console.log("Now true " + decrypted.device);
            }
            else{
              decrypted.device = false;
              // console.log("Now false " + decrypted.device);
            }
            console.log(decrypted.device);
            decrypted.latitude  = $crypto.decrypt(encrypted.latitude);            
            decrypted.longitude  = $crypto.decrypt(encrypted.longitude);            
            $scope.location = decrypted;
            console.log($scope.location);
          // }
        });        
      }
      else if(id == 2){
        $ionicModal.fromTemplateUrl('templates/serverSettingsModal.html', {
            scope: $scope
        }).then(function (modal) {

            $scope.modal = modal;
            $scope.modal.show();

            //decyption
            var decrypted = {serverType:'', host:'', port:'', username: '', password: ''};
            // if($scope.location.latitude == "" || $scope.location.longitude == ""){
              encrypted = JSON.parse(localStorage.getItem('serverSettings'));
              if(encrypted == null)
                return;

              decrypted.serverType  = $crypto.decrypt(encrypted.serverType);
              if(decrypted.serverType == "true"){
                decrypted.serverType = true;
                // console.log("Now true " + decrypted.device);
              }
              else{
                decrypted.serverType = false;
                // console.log("Now false " + decrypted.device);
              }
              decrypted.host  = $crypto.decrypt(encrypted.host);
              decrypted.port  = $crypto.decrypt(encrypted.port);
              //decrypted.username  = $crypto.decrypt(encrypted.username);
              decrypted.password  = $crypto.decrypt(encrypted.password);
              console.log(decrypted);
              $scope.serverSettings = decrypted;
              // console.log($scope.serverSettings);              
            // }

        });          
      }    
    }

    $scope.logout = function(){
      userAuth.userLogout();
    }

})
