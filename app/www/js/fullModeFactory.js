souq.factory('fullModeFactory', function($crypto, $http, $ionicLoading, $ionicPopup, $q, requestService) {

	return {
		getDetails: function() 
		{
			return $q(function(resolve, reject) {

				var serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
				if(serverSettings == null)
					return resolve();

				var payload = {
				  "method": "get",
				  "request": "deposit",
				  "admin": true
				};

				requestService.sendFullRequest(payload).then(function(data){
					console.log(data);
					deposit = data;

					var payload = {
						"method": "get",
						"request": "balance",
						"admin": true
					};

					requestService.sendFullRequest(payload).then(function(data){
						console.log(data);
						balance = data;
						return resolve({balance: balance, deposit: deposit});
					}).catch(function(error){
						return reject(error);
					});

				}).catch(function(error){
					return reject(error);
				});
			});
		},

		getProjects: function() 
		{
			return $q(function(resolve, reject) {
	      		var serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
	      		if(serverSettings == null)
	      			return resolve([]);

	      		var payload = {
		          "method": "get",
		          "request": "owned",
		          "admin": true
		        };

	      		requestService.sendFullRequest(payload).then(function(data){
					return resolve(data);
				}).catch(function(error){
					return reject(error);
				});
			});
      	},

      	getRecacheToken: function() 
		{
			return $q(function(resolve, reject) {
	      		var serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
	      		if(serverSettings == null)
	      			return resolve([]);

		        $ionicLoading.show();
		        var header = {
		          "alg": "HS256",
		          "typ": "JWT"
		        };
		        var stringifiedHeader = $crypto.parseData(header);
		        var encodedHeader = $crypto.base64url(stringifiedHeader);

		        var payload = {
		            "method": "get",
					"request": "token",
					"admin": true
		        };

		        var stringifiedPayload = $crypto.parseData(payload);
		        var encodedPayload = $crypto.base64url(stringifiedPayload);
		        
		        var encrypted = JSON.parse(localStorage.getItem('serverSettings'));
		        var decrypted = {serverType:'', host:'', port:'', username: '', password: ''};
		        
		        decrypted.serverType  = $crypto.decrypt(encrypted.serverType);
		          if(decrypted.serverType == "true")
		            decrypted.serverType = 'http';
		          else
		            decrypted.serverType = 'https';
		          
		        decrypted.host  = $crypto.decrypt(encrypted.host);
		        decrypted.port  = $crypto.decrypt(encrypted.port);
		        decrypted.password  = $crypto.decrypt(encrypted.password);
		        
		        var serverSettings = decrypted;

		        var token = encodedHeader + "." + encodedPayload;
		        token = $crypto.encryptHMA(token, decrypted.password);
		        token = $crypto.base64url(token);
		        
		        var urlOwned = decrypted.serverType + '://' + decrypted.host + ':' + decrypted.port + '/get?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;
	        	var owned = "";

		        $http.get(urlOwned, {timeout: 10000}).success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
		            console.log(data);
		            $ionicLoading.hide();
		            return resolve(data);
		        })
		        .error(function(data, status, headers, config){
		            console.log('data error urlOwned');
		            $ionicLoading.hide();
		            $ionicPopup.alert({
		              title: 'Error',
		              template: "Can't Connect, Please Check Settings Or Node and Try Again",
		              buttons: [{
		                text:'OK'
		              }]
		            });

		            return reject();
		        });
	    	});
		},

		postRecacheToken: function(token) 
		{
			console.log(token);
			var payload = {
	            "method": "post",
				"request": "recache",
				"token": token,
				"admin": true
		    };

			return $q(function(resolve, reject) {
	      		var serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
	      		if(serverSettings == null)
	      			return resolve([]);

		        $ionicLoading.show();
		        var header = {
		          "alg": "HS256",
		          "typ": "JWT"
		        };
		        var stringifiedHeader = $crypto.parseData(header);
		        var encodedHeader = $crypto.base64url(stringifiedHeader);
		        
		        console.log(payload);

		        var stringifiedPayload = $crypto.parseData(payload);
		        var encodedPayload = $crypto.base64url(stringifiedPayload);
		        
		        var encrypted = JSON.parse(localStorage.getItem('serverSettings'));
		        var decrypted = {serverType:'', host:'', port:'', username: '', password: ''};
		        
		        decrypted.serverType  = $crypto.decrypt(encrypted.serverType);
		          if(decrypted.serverType == "true")
		            decrypted.serverType = 'http';
		          else
		            decrypted.serverType = 'https';
		          
		        decrypted.host  = $crypto.decrypt(encrypted.host);
		        decrypted.port  = $crypto.decrypt(encrypted.port);
		        decrypted.password  = $crypto.decrypt(encrypted.password);
		        
		        var serverSettings = decrypted;

		        var token = encodedHeader + "." + encodedPayload;
		        token = $crypto.encryptHMA(token, decrypted.password);
		        token = $crypto.base64url(token);
		        
		        var urlOwned = decrypted.serverType + '://' + decrypted.host + ':' + decrypted.port + '/post?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;
	        	var owned = "";

		        $http.post(urlOwned, {timeout: 10000}).success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
		            console.log(data);
		            $ionicLoading.hide();
		            $ionicPopup.alert({
		              title: 'Success',
		              template: data.message,
		              buttons: [{
		                text:'OK'
		              }]
		            });
		            return resolve(data);
		        })
		        .error(function(data, status, headers, config){
		            console.log('data error urlOwned');
		            $ionicLoading.hide();
		            $ionicPopup.alert({
		              title: 'Error',
		              template: "Can't Connect, Please Check Settings Or Node and Try Again",
		              buttons: [{
		                text:'OK'
		              }]
		            });

		            return reject();
		        });
	    	});
		},


		searchProjects: function(searchType, data) 
		{
			return $q(function(resolve, reject) {

				switch (searchType) 
				{
		            case 1:
		                if(data.longitude == '')
					        data.longitude = null;
					    if(data.latitude == '')
					        data.latitude = null;
					    if(data.distance == '')
					        data.distance = 0;

					    var payload = {
					        "method": "get",
					        "request": "search",
					        "search": "proximity",
					        "longitude": data.longitude,
					        "latitude": data.latitude,
					        "distance": data.distance,
					        "unittype": data.unit,
					        "admin": true
					    };

		                break;

		            case 2:
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
					    if (data.stage == '')
					        data.stage = null;

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
					        "address":data.address,
					        "stage": data.stage,
					        "admin":true
				      	};

		                break;

		            case 3:
		            	if (data.projectId == '')
	        				data.projectId = null;

	        			var payload = {
					        "method": "get",
					        "request": "lookup",
					        "id": data.projectId,
					        "admin": true
					    };

		            	break;
	        	}

	        	console.log(payload);
	        	requestService.sendFullRequest(payload).then(function(data){
					return resolve(data);
				}).catch(function(error){
					return reject(error);
				});
			});
		}
    };

});