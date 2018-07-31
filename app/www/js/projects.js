souq.controller('ProjectsCtrl', function($scope, $state, Projects, $ionicModal, userAuth, $http, $crypto, $ionicPopup, $interval, $ionicLoading, $cordovaCamera, fullModeFactory, lightModeFactory, requestService) {

	$scope.serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
	$scope.mode = localStorage.getItem('mode');

	console.log($scope.mode);
	
	//New Project Start
	function geolocationSuccess(location) {
      $scope.newProject.latitude = location.coords.latitude;
      $scope.newProject.longitude = location.coords.longitude;
    }

    function geolocationError(err) {
      console.log(err);
    }
    navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError);

    $scope.newProject = {};
    $scope.newProject.stage = "In Progress";
    $scope.type = 'Default';
    $scope.imgURI;

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

    $scope.openProjectModal = function()
    {
    	if ($scope.serverSettings == undefined) 
    	{
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
	        });

	        return;
    	}

      	$ionicModal.fromTemplateUrl('templates/newProjectModal.html', {
        	scope: $scope
      	}).then(function (modal) {
        	$scope.modal = modal;
        	$scope.id='';

        	$scope.id = $scope.makeId();
          	var payload = {
	            "method": "get",
	            "request": "price",
	            "id": $scope.id,
	            "admin": true
          	};

          	requestService.sendFullRequest(payload).then(function(data){
	            console.log(data);
	            $scope.warnings = data.warnings;
	            $scope.priceData = data;
          	});
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
        return $scope.id;
    }

    $scope.createProject = function (u) {
      $scope.newproject.push({ name: u.firstName + ' ' + u.lastName });
      $scope.modal.hide();
    };

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

	    if(newProject.stage == undefined || newProject.stage == null )
	    	newProject.stage = "In Progress";

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
				"detail": newProject.detail,
				"stage": newProject.stage
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
		}).catch(function(err) {
			console.log(err);
		})
	} 
	//New Project End

	//Search Features Start
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
			$scope.propertyData = {keyword:'', category:'Roads', type:'Donation', stage: 'In Progress', detail:'', phone:'', email:'', website:'', address:''}
			$scope.proximityData = {longitude:$scope.newProject.longitude, latitude:$scope.newProject.latitude, distance:0};
			$scope.projectId = {projectId:''}
		});        
	}

	$scope.hideSeacrhModal = function(){
		$scope.seacrhModal.hide();
	}

	$scope.showSelectValue = function(type) {
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
	};

	$scope.onNumberChange = function() {
		if($scope.proximityData.distance == undefined){
			$scope.proximityData.distance = 50000;
		}
	}

	$scope.search = function(type, data) {

		console.log(type);
		console.log(data);

		var mode = localStorage.getItem('mode');

		if(mode == null)
			mode = 'lite';

		console.log(mode);

		if(mode == 'full')
		{
			fullModeFactory.searchProjects(type, data).then(function(res){
				$scope.proximityReturnedData = res;
				$scope.propertiesReturnedData = res;
				$scope.projectIDReturnedData = res;
	        	$scope.seacrhModal.hide();
			})
			.catch(function(err){
				console.log(err);
			});
		}
		else if(mode == 'lite')
		{
			lightModeFactory.searchProjects(type, data).then(function(res){
				$scope.proximityReturnedData = res;
				$scope.propertiesReturnedData = res;
				$scope.projectIDReturnedData = res;
	        	$scope.seacrhModal.hide();
			})
			.catch(function(err){
				console.log(err);
			});
		}
		
	}
	//Search features End
});
