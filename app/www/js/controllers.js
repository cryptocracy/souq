souq

.controller('ProjectsCtrl', function($scope, $state, Projects, $ionicModal, userAuth, $http, $crypto, $ionicPopup, $interval, $ionicLoading, $cordovaCamera) {

  // (function(){
    // if (userAuth.isAuthenticate()) {
    $scope.newproject = [ //place holder object to get modal modal  
      { name: 'Gordon Freeman' },
      { name: 'Barney Calhoun' },
      { name: 'Lamarr the Headcrab' },
    ];

    // New Project Modal

    $scope.openProjectModal = function(){
      $ionicModal.fromTemplateUrl('templates/newProjectModal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.id='';

        if ($scope.serverSettings != undefined) {

          $scope.id = $scope.makeId(); 
          var header = {
            "alg": "HS256",
            "typ": "JWT"
          };
          var stringifiedHeader = $crypto.parseData(header);
          var encodedHeader = $crypto.base64url(stringifiedHeader);

          var payload = {
            "method": "get",
            "request": "price",
            "id": $scope.id,
            "admin": true
          };
          console.log(payload);
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
          console.log(urlOwned);

          $http.get(urlOwned)
            .success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
              console.log('data sucess urlOwned');
              console.log(data);
              $scope.warnings = data.warnings;
              $scope.priceData = data;
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

        $scope.modal.show();
      });
    }

    $scope.makeId = function()
    {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 24; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        console.log("pr01-"+text+".id");
        $scope.id = "pr01-"+ text;
        // $scope.id = "pr01-"+ text +".id";            
        return $scope.id;
    }

    $scope.createProject = function (u) {
      $scope.newproject.push({ name: u.firstName + ' ' + u.lastName });
      $scope.modal.hide();
    };

    //$scope.projects = Projects.all();
    $scope.remove = function(project) {
      Projects.remove(project);
    };
   

  // Projects Details function

   $scope.projects = function() {
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
        //decrypted.username  = $crypto.decrypt(encrypted.username);
        decrypted.password  = $crypto.decrypt(encrypted.password);
        
        $scope.serverSettings = decrypted;

        var token = encodedHeader + "." + encodedPayload;
        token = $crypto.encryptHMA(token, decrypted.password);
        token = $crypto.base64url(token);
        
        // var urlOwned = decrypted.serverType + '://' + decrypted.host + ':' + decrypted.port + '/get?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;
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

   $scope.interval;
    $scope.getDetails = function() {
      // $scope.serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
      // if ($scope.serverSettings != undefined) {
      //   $ionicLoading.show();
      //   var header = {
      //     "alg": "HS256",
      //     "typ": "JWT"
      //   };
      //   var stringifiedHeader = $crypto.parseData(header);
      //   var encodedHeader = $crypto.base64url(stringifiedHeader);

      //   var payload = {
      //     "method": "get",
      //     "request": "price",
      //     "id": "pr01-3d279xmacdklazzj2vfyvd90",
      //     "admin": true
      //   };

      //   var stringifiedPayload = $crypto.parseData(payload);
      //   var encodedPayload = $crypto.base64url(stringifiedPayload);
        
      //   let encrypted = JSON.parse(localStorage.getItem('serverSettings'));
      //   let decrypted = {serverType:'', host:'', port:'', username: '', password: ''};
        
      //   decrypted.serverType  = $crypto.decrypt(encrypted.serverType);
      //     if(decrypted.serverType == "true")
      //       decrypted.serverType = 'http';
      //     else
      //       decrypted.serverType = 'https';
          
      //   decrypted.host  = $crypto.decrypt(encrypted.host);
      //   decrypted.port  = $crypto.decrypt(encrypted.port);
      //   decrypted.password  = $crypto.decrypt(encrypted.password);
        
      //   $scope.serverSettings = decrypted;

      //   var token = encodedHeader + "." + encodedPayload;
      //   token = $crypto.encryptHMA(token, decrypted.password);
      //   token = $crypto.base64url(token);
        
      //   var urlProjects = decrypted.serverType + '://' + decrypted.host + ':' + decrypted.port + '/get?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;
      //   console.log(urlProjects);
      //   $scope.project = "";

      //   $http.get(urlProjects, {timeout: 10000})
      //     .success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
      //       console.log('data success urlProjects');
      //       console.log(data);
      //       $scope.project = data;
      //       $ionicLoading.hide();
      //     })
      //     .error(function(data, status, headers, config){
      //       console.log('data error urlProjects');
      //       $ionicLoading.hide();
      //       $interval.cancel($scope.interval);
      //       $ionicPopup.alert({
      //         title: 'Error',
      //         template: "Can't Connect, Please Check Settings Or Server and Try Again",
      //         buttons: [{
      //           text:'OK'
      //         }]
      //       });
      //     });
      // }
      // else {
      //   var confirmPopup = $ionicPopup.confirm({
      //     title: 'No server settings found!!',
      //     template: 'Please setup your server settings'
      //   });

      //   confirmPopup.then(function(res) {
      //     if(res) {
      //       $ionicModal.fromTemplateUrl('templates/serverSettingsModal.html', {
      //         scope: $scope
      //       }).then(function (modal) {
      //         $scope.modal = modal;
      //         $scope.modal.show();
      //       });
      //     } 
      //     else {
      //       console.log('You are not sure');
      //     }
      //   });
      // }
    }
    $scope.serverSettings = JSON.parse(localStorage.getItem('serverSettings'));

    if ($scope.serverSettings == undefined) {
      $scope.getDetails();  
    }
    else if ($scope.serverSettings != undefined) {
      $scope.getDetails(); 
      $scope.interval = $interval(function () {
        $scope.getDetails(); 
      }, 25000)
    }

  // Saving Data

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
    
  // For Camera Picture Code

  // $scope.imgURI= "./img/adam.jpg";
  $scope.imgURI;
  $scope.takePhoto = function () {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
  };

      $cordovaCamera.getPicture(options).then(function (imageData) {
          $scope.imgURI = "data:image/jpeg;base64," + imageData;
      }, function (err) {
          // An error occured. Show a message to the user
          console.log("Error in Clicking Camera");
      });
  }



  // Function for Creating Projects from posting data
  $scope.saveProject = function(newProject){      
          
      // console.log(newProject);
      localStorage.setItem('project', JSON.stringify(newProject));
      
      // $scope.hideToast();      

      $scope.serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
      if ($scope.serverSettings != undefined) {
        $ionicLoading.show();
        var header = {
          "alg": "HS256",
          "typ": "JWT"
        };
        var stringifiedHeader = $crypto.parseData(header);
        var encodedHeader = $crypto.base64url(stringifiedHeader);
        console.log($scope.id);
        var payload = {
          "method":"post",
          "request":"register",
          "admin":true,
          "v":"1.0.1",
          "childof":"",
          "id":$scope.id,
          "project":{
              "type": newProject.type,
              "category": newProject.category,
              "title": newProject.title,
              "detail": newProject.detail
          },
          "bitcoin":{
              "address": newProject.address,
              "goal": newProject.goal
          },
          "coordinates":{
              "latitude": newProject.latitude,
              "longitude": newProject.longitude
          },
          "image":{
              // "url": $scope.imgURI
              "url":"./img/adam.jpg"
          },
          "contacts":{
              "phone": newProject.phone,
              "email": newProject.email,
              "website": newProject.website
          },
          "children":{

          }



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
        
        // var urlProjects = decrypted.serverType + '://' + decrypted.host + ':' + decrypted.port + '/post?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;
        var urlProjects = decrypted.serverType + "://" + decrypted.host + ':' + decrypted.port + '/post?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;

        $scope.project = "";
        console.log(urlProjects);
        $http.post(urlProjects)
        // $http.post(urlProjects, payload)
          .success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
            // console.log('data sucess');
            console.log(data);
            console.log("Project has been Saved");
            $scope.dataSaveAlert();
            $scope.project = data;
            $ionicLoading.hide();
          })
          .error(function(data, status, headers, config){
            console.log('error in posting');
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

})

// Projects Detail Controller

.controller('ProjectDetailCtrl', function($scope, $ionicModal, $stateParams, Projects) {
  $scope.project = Projects.get($stateParams.projectId);

  $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
  }).then(function (modal) {
      $scope.modal = modal;
  });
})

.controller('NewCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


