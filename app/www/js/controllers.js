souq

.controller('ProjectsCtrl', function($scope, $state, Projects, $ionicModal, userAuth, $http, $crypto, $ionicPopup, $interval, $ionicLoading, $cordovaCamera) {
    console.log('ProjectsCtrl')
    $scope.newProject = {};
    $scope.type = 'Default';
    function geolocationSuccess(location) {
      $scope.newProject.latitude = location.coords.latitude;
      $scope.newProject.longitude = location.coords.longitude;
    }

    function geolocationError(err) {
      console.log(err);
    }

    $scope.scanQr = function() {
    window.cordova.plugins.barcodeScanner.scan(
      function (result) {
        // $ionicLoading.show();
        var id = result.text;
        $scope.newProject.address = result.text.replace(/Bitcoin:/g, '');

        if(id != undefined && parseInt(id) > 0) {
          console.log(id, result)
          $scope.newProject.address = result.text.replace(/Bitcoin:/g, '');
        }
        else {
          // $ionicLoading.hide();
          alert("We could not find an address with this QR Code");       
        }
      }, 
      function (error) {
        alert("Scanning failed: " + error);
      });
  }

    navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError);

    $scope.openProjectModal = function(){
      $ionicModal.fromTemplateUrl('templates/newProjectModal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.id='';

        if ($scope.serverSettings != undefined) 
        {
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

    $scope.projects = Projects.all();
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
    console.log('ff');  
    var newProject = $scope.newProject;
    console.log(newProject)
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
      var header = {
        "alg": "HS256",
        "typ": "JWT"
      };
      var stringifiedHeader = $crypto.parseData(header);
      var encodedHeader = $crypto.base64url(stringifiedHeader);
      // console.log(newProject.goal);
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
            "url": newProject.imgURI
        },
        "contacts":{
            "phone": newProject.phone,
            "email": newProject.email,
            "website": newProject.website
        },
        "children":{

        }
      };
      if (payload.project.type == undefined || payload.project.category == undefined || payload.project.title == undefined || payload.project.detail == undefined || payload.bitcoin.address == undefined || payload.bitcoin.goal == undefined || payload.contacts.email == undefined) {
        console.log('undefined')
        $ionicPopup.alert({
          title: 'Empty Fields',
          template: "Fields cannot be empty!!",
          buttons: [{
            text:'OK'
          }]
        });
        return;
      }
      if (payload.project.type == "" || payload.project.category == "" || payload.project.title == "" || payload.project.detail == "" || payload.bitcoin.address == "" || payload.bitcoin.goal == "" || payload.contacts.email == "") {
        console.log('null')
        $ionicPopup.alert({
          title: 'Empty Fields',
          template: "Fields cannot be empty!!",
          buttons: [{
            text:'OK'
          }]
        });
        return;
      }
      var x = payload.contacts.email;
      var atpos = x.indexOf("@");
      var dotpos = x.lastIndexOf(".");
      if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
          $ionicPopup.alert({
          title: 'Wrong Email',
          template: "Not a valid e-mail address",
          buttons: [{
            text:'OK'
          }]
        });
        return;
      }
      $ionicLoading.show();
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

  $scope.openProjectModal = function(){
    $ionicModal.fromTemplateUrl('templates/newProjectModal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
      $scope.id='';
      // console.log($scope.saveProject);

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

  $scope.openSeacrhModal = function(){
    $ionicModal.fromTemplateUrl('templates/searchModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    })
    .then(function(modal) {                  
      $scope.seacrhModal = modal;
      $scope.seacrhModal.show();
      $scope.type = 'Proximity';
      $scope.unit = 'm';
      $scope.propertyData = {keyword:'', category:'Roads', type:'Donation', detail:'', phone:'', email:'', website:'', address:''}
      $scope.proximityData = {longitude:$scope.newProject.longitude, latitude:$scope.newProject.latitude, distance:0};
      $scope.projectId = {projectId:''}
    });        
  }

  $scope.hideSeacrhModal = function(){
    $scope.seacrhModal.hide();
  }

  $scope.showSelectValue = function(type) {
    console.log(type);
    $scope.type = type;
  }

  $scope.setUnit = function(unit) {
    if (unit == 'Meters')
      $scope.unit = 'm';
    else if (unit == 'Kilometers')
      $scope.unit = 'km';
    else if (unit == 'Feet')
      $scope.unit = 'ft';
    else if (unit == 'Miles')
      $scope.unit = 'mi';
    console.log(unit, $scope.unit);
  };

  $scope.onNumberChange = function() {
    console.log('fire', $scope.proximityData.distance)
    // if ($scope.proximityData.distance == null) return;

     if($scope.proximityData.distance == undefined){
      console.log('greater')
      $scope.proximityData.distance = 50000;
    }
  }

  $scope.search = function(type, data) {
    $ionicLoading.show();
    if (type == 1) {
      if(data.longitude == '')
        data.longitude = null;
      if(data.latitude == '')
        data.latitude = null;
      if(data.distance == '')
        data.distance = null;
      
      var header = {
        "alg": "HS256",
        "typ": "JWT"
      };
      var stringifiedHeader = $crypto.parseData(header);
      var encodedHeader = $crypto.base64url(stringifiedHeader);

      var payload = {
        "method": "get",
        "request": "search",
        "search": "proximity",
        "longitude": $scope.proximityData.longitude,
        "latitude": $scope.proximityData.latitude,
        "distance": $scope.proximityData.distance,
        "unittype": $scope.unit,
        "admin": true
      };
      if (payload.distance == null)
        payload.distance = '0';
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
        $scope.proximityReturnedData = data;
        $scope.seacrhModal.hide();
        $ionicLoading.hide();
      })
      .error(function(data, status, headers, config){
        console.log('data error urlOwned');
        $ionicLoading.hide();
        // $interval.cancel($scope.interval);
        $ionicPopup.alert({
          title: 'Error',
          template: "Can't Connect, Please Check Settings Or Server and Try Again",
          buttons: [{
            text:'OK'
          }]
        });
      });
    }

    else if (type == 2) {
      if (data.keyword == '')
        data.keyword = null;
      if (data.category == '')
        data.category = null;
      if (data.type == '')
        data.type = null;
      if (data.detail == '')
        data.detail = null;
      if (data.phone == '')
        data.phone = null;
      if (data.email == '')
        data.email = null;
      if (data.website == '')
        data.website = null;
      if (data.address == '')
        data.address = null;
      
      var header = {
        "alg": "HS256",
        "typ": "JWT"
      };
      var stringifiedHeader = $crypto.parseData(header);
      var encodedHeader = $crypto.base64url(stringifiedHeader);

      var payload = {
        "method":"get",
        "request":"search",
        "search":"properties",
        "type":data.type,
        "category":data.category,
        "keyword":data.keyword,
        "phone": data.phone,
        "email": data.email,
        "website": data.website,
        "address":data.address,//'pr01-mdf9kesl9v92lclivkrfcgt1'
        "admin":true
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
        $scope.propertiesReturnedData = data;
        console.log($scope.propertiesReturnedData);
        $scope.seacrhModal.hide();
        $ionicLoading.hide();
      })
      .error(function(data, status, headers, config){
        console.log('data error urlOwned');
        $ionicLoading.hide();
        // $interval.cancel($scope.interval);
        $ionicPopup.alert({
          title: 'Error',
          template: "Can't Connect, Please Check Settings Or Server and Try Again",
          buttons: [{
            text:'OK'
          }]
        });
      });
    }

    else if (type == 3) {
      if (data.projectId == '')
        data.projectId = null;

      var header = {
        "alg": "HS256",
        "typ": "JWT"
      };
      var stringifiedHeader = $crypto.parseData(header);
      var encodedHeader = $crypto.base64url(stringifiedHeader);

      var payload = {
        "method": "get",
        "request": "lookup",
        "id": data.projectId,
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
        $scope.projectIDReturnedData = data;
        $scope.seacrhModal.hide();
        $ionicLoading.hide();
      })
      .error(function(data, status, headers, config){
        console.log('data error urlOwned');
        $ionicLoading.hide();
        // $interval.cancel($scope.interval);
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

  $scope.scanQr = function() {
    window.cordova.plugins.barcodeScanner.scan(
      function (result) {
        // $ionicLoading.show();
        var id = result.text;
        $scope.propertyData.address = result.text.replace(/Bitcoin:/g, '');

        if(id != undefined && parseInt(id) > 0) {
          console.log(id, result)
          $scope.propertyData.address = result.text.replace(/Bitcoin:/g, '');
        }
        else {
          // $ionicLoading.hide();
          alert("We could not find a project with this QR Code");       
        }
      }, 
      function (error) {
        alert("Scanning failed: " + error);
      });
  }

  $scope.scan = function(status) {
    console.log(1);
    console.log(QRScanner)
    // This function is not calling. Although .scan method exist in QRScanner//
    QRScanner.scan(function(err, contents){
      console.log(2)
      if(err){
        console.log(3, err)
        if(err.name === 'SCAN_CANCELED') {
          console.error('The scan was canceled before a QR code was found.');
        } else {
          console.log(4)
          console.error(err._message);
        }
      }
      else{
        console.log(5);
        console.log('Scan returned: ' + contents);
      }
    });
    ////////////////////////////////////////////////
  }
})

// Projects Detail Controller

.controller('ProjectDetailCtrl', function($scope, $sce, $crypto, $http, $ionicPopup, $ionicLoading, $ionicModal, $stateParams, Projects) {

  console.log($stateParams.projectId);
  // $stateParams.projectId = 'pr01-mdf9kesl9v92lclivkrfcgt1';
  $scope.serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
  if ($scope.serverSettings != null) 
  {
    $ionicLoading.show();
    var header = {
      "alg": "HS256",
      "typ": "JWT"
    };
    var stringifiedHeader = $crypto.parseData(header);
    var encodedHeader = $crypto.base64url(stringifiedHeader);

    var payload = {
      "method": "post",
      "request": "lookup",
      "id": $stateParams.projectId,
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
        $scope.project = data.project[0];
        $scope.mapUrl = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyAWxGXO9vhpM__adRAQKutoZmebivcX1Ls&q=' + $scope.project.coordinates.latitude + ',' + $scope.project.coordinates.longitude;
        $sce.trustAsResourceUrl($scope.mapUrl);
        console.log($scope.project);
        console.log($scope.mapUrl);
        $ionicLoading.hide();
      })
      .error(function(data, status, headers, config){
        console.log('data error urlOwned');
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: 'Error',
          template: "Can't Connect, Please Check Settings Or Server and Try Again",
          buttons: [{
            text:'OK'
          }]
        });
      });
  }
  // $ionicModal.fromTemplateUrl('templates/modal.html', {
  //     scope: $scope
  // }).then(function (modal) {
  //     $scope.modal = modal;
  // });
})

.controller('NewCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


