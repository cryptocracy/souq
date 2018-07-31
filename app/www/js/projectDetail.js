souq.controller('ProjectDetailCtrl', function($scope, $sce, $crypto, $http, $ionicPopup, $ionicLoading, $ionicModal, $stateParams, Projects, requestService, lightModeFactory, fullModeFactory, $cordovaCamera, $ionicActionSheet) {
	console.log($stateParams.projectId);

    $scope.mode = localStorage.getItem('mode');
    $scope.owned = [];
    $scope.newProject = {};
    $scope.edit = false;
    $scope.bitcoinUrl = "";
    $scope.balance = 0;

    if($scope.mode == null)
        $scope.mode = 'lite';


    $scope.getBalance = function() {
        $http.get('https://blockchain.info/q/addressbalance/' + $scope.project.bitcoin.address, {timeout: 10000}).success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
            console.log(data);

            $scope.balance = data / 100000000;

            $scope.remain = parseInt(($scope.balance / $scope.project.bitcoin.goal) * 100);
        });
    }

    $scope.openAction = function() {
        
        var buttons = [];
        buttons.push({ text: 'Fund with External Wallet' });

        if($scope.mode != 'lite')
            buttons.push({ text: 'Fund with Blockstack Wallet' });

        $ionicActionSheet.show({
            buttons: buttons,
            titleText: 'Funding Options',
            cancelText: 'Cancel',
            buttonClicked: function(index) {
                if(index == 0)
                {
                    var sApp = startApp.set({
                        "action": "ACTION_VIEW",
                        "uri":$scope.bitcoinUrl
                    }).start();

                    return true;
                }
            }
        });
    }

    if($scope.mode == 'lite')
    {
        lightModeFactory.getDetails($stateParams.projectId).then(function(data) {
          console.log(data);
          $scope.project = data.project[0];
          $scope.mapUrl = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyAWxGXO9vhpM__adRAQKutoZmebivcX1Ls&q=' + $scope.project.coordinates.latitude + ',' + $scope.project.coordinates.longitude;
          $scope.bitcoinUrl = 'bitcoin:' + $scope.project.bitcoin.address;
          $sce.trustAsResourceUrl($scope.mapUrl);
          $sce.trustAsResourceUrl($scope.bitcoinUrl);

          console.log($scope.project);
          console.log($scope.mapUrl);
          console.log($scope.bitcoinUrl);
          $scope.getBalance();
        });
    }
    else
    {
        fullModeFactory.getProjects().then(function(res){

          $scope.owned = res.names_owned;
          console.log($scope.owned);

          var payload = {
            "method": "post",
            "request": "lookup",
            "id": $stateParams.projectId,
            "admin": true
        };

        requestService.sendFullRequest(payload).then(function(data){
            $scope.project = data.project[0];

            if($scope.owned.length > 0 && $scope.owned.indexOf($scope.project.id) >= 0)
                $scope.edit = true;
            
            console.log($scope.edit);
            console.log($scope.project);

            $scope.mapUrl = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyAWxGXO9vhpM__adRAQKutoZmebivcX1Ls&q=' + $scope.project.coordinates.latitude + ',' + $scope.project.coordinates.longitude;
            $scope.bitcoinUrl = 'bitcoin:' + $scope.project.bitcoin.address;
            $sce.trustAsResourceUrl($scope.mapUrl);
            $sce.trustAsResourceUrl($scope.bitcoinUrl);

            console.log($scope.bitcoinUrl);
            $scope.getBalance();
        })
        .catch(function(err) {
            console.log(err);
        })
    });

    $scope.editProject = function(){
        $ionicModal.fromTemplateUrl('templates/newProjectModal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;

            $scope.id = $scope.project.id;
            $scope.newProject.type = $scope.project.project.type;
            $scope.newProject.category = $scope.project.project.category;
            $scope.newProject.title = $scope.project.project.title;
            $scope.newProject.detail = $scope.project.project.detail;
            $scope.newProject.address = $scope.project.bitcoin.address;
            $scope.newProject.goal = $scope.project.bitcoin.goal;
            $scope.newProject.latitude = $scope.project.coordinates.latitude;
            $scope.newProject.longitude = $scope.project.coordinates.longitude;
            $scope.newProject.imgURI = $scope.project.image.url;
            $scope.newProject.phone = $scope.project.contacts.phone;
            $scope.newProject.email = $scope.project.contacts.email;
            $scope.newProject.website = $scope.project.contacts.website;

            if($scope.project.project.stage != undefined && $scope.project.project.stage != null)
                $scope.newProject.stage = $scope.project.project.stage;
            else
                $scope.newProject.stage = "In Progress";

            $scope.modal.show();
        });
    }

    //update project start
    function geolocationSuccess(location) {
      $scope.latitude = location.coords.latitude;
      $scope.longitude = location.coords.longitude;
      console.log(location.coords);
    }

    function geolocationError(err) {
      console.log(err);
    }
    navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError);

    $scope.updateCoordinates = function() {
        $scope.newProject.latitude = $scope.latitude;
        $scope.newProject.longitude = $scope.longitude;
    }

    $scope.scanQr = function() {
      window.cordova.plugins.barcodeScanner.scan(
        function (result) {
          var id = result.text;
          $scope.newProject.address = result.text.replace(/Bitcoin:/g, '');

          if(id != undefined && parseInt(id) > 0) {
            console.log(id, result)
            $scope.newProject.address = result.text.replace(/Bitcoin:/g, '');
          }
          else {
            alert("We could not find an address with this QR Code");       
          }
        }, 
        function (error) {
          alert("Scanning failed: " + error);
        }
      );
    }

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
            console.log(err);
        });
    }

    $scope.saveProject = function()
    {
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

        var payload = {
            "method":"post",
            "request":"update",
            "admin":true,
            "v":"1.0.1",
            "childof":"",
            "id":$scope.id,
            "project":{
                "type": newProject.type,
                "category": newProject.category,
                "title": newProject.title,
                "detail": newProject.detail,
                "stage": newProject.stage,
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
            "children":{}
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

        requestService.sendFullRequest(payload, "post").then(function(res) {
            console.log(res);
            if(res.error)
            {
                $ionicPopup.alert({
                    title: 'Error',
                    template: res.error,
                    buttons: [{
                      text:'OK'
                    }]
                });
            }
            else
            {
                $ionicPopup.alert({
                    title: 'Success',
                    template: res.message,
                    buttons: [{
                    text:'OK'
                    }]
                });
                
                $scope.modal.hide();
            }
        }).catch(function(err) {
            console.log(err);
        })
    } 
    //update project ends
}

});