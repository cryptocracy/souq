souq

.controller('ProjectsCtrl', function($scope, $state, Projects, $ionicModal, userAuth, $http, $crypto, $ionicPopup, $interval, $ionicLoading, $cordovaCamera) {

    $scope.newProject = {};

    function geolocationSuccess(location) {
      $scope.newProject.latitude = location.coords.latitude;
      $scope.newProject.longitude = location.coords.longitude;
    }

    function geolocationError(err) {
      console.log(err);
    }

    navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError);

    $scope.openProjectModal = function(){
      $ionicModal.fromTemplateUrl('templates/newProjectModal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.id='';

        if ($scope.serverSettings != undefined) {
          $ionicLoading.show();
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
          // console.log(payload);
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
              $ionicLoading.hide();
            })
            .error(function(data, status, headers, config){
              console.log('data error urlOwned');
              $ionicLoading.hide();
              $interval.cancel($scope.interval);
              $ionicPopup.alert({
                title: 'Error',
                template: "Can't Connect, Please Check Settings Or Node and Try Again",
                buttons: [{
                  text:'OK'
                }]
              });
            });
        }
        else {
          var confirmPopup = $ionicPopup.confirm({
            title: 'No Node settings found!!',
            template: 'Please setup your Node settings'
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
   
    $scope.serverSettings = JSON.parse(localStorage.getItem('serverSettings'));

  $scope.dataSaveAlert = function(){    
      $ionicPopup.alert({
        title: 'Save',
        template: 'Successfully Updated!',
        buttons: [{
          text:'OK',
          onTap: function(e) {
            $scope.modal.hide();
            // $scope.getDetails();
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
  $scope.saveProject = function(){      

    var newProject = $scope.newProject;

    if (newProject == undefined) {
      $ionicPopup.alert({
        title: 'Empty Fields',
        template: "Fields cannot be empty!!",
        buttons: [{
          text:'OK'
        }]
      });
      return;
    }
    localStorage.setItem('project', JSON.stringify(newProject));
    
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
            "title": newProject.title.replace("'", ""),
            "detail": newProject.detail.replace("'", "")
        },
        "bitcoin":{
            "address": newProject.address.replace("'", ""),
            "goal": newProject.goal.replace("'", "")
        },
        "coordinates":{
            "latitude": newProject.latitude,
            "longitude": newProject.longitude
        },
        "image":{
            "url": newProject.imgURI
        },
        "contacts":{
            "phone": newProject.phone.replace("'", ""),
            "email": newProject.email.replace("'", ""),
            "website": newProject.website.replace("'", "")
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
            template: "Can't Connect, Please Check Settings Or Node and Try Again",
            buttons: [{
              text:'OK'
            }]
          });
        });
    }
    else {
      var confirmPopup = $ionicPopup.confirm({
        title: 'No Node settings found!!',
        template: 'Please setup your Node settings'
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


