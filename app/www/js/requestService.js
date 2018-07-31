souq.factory('requestService', function($crypto, $http, $ionicLoading, $ionicPopup, $q) {

	return {
		sendFullRequest: function(payload, type) {
			
			return $q(function(resolve, reject) {
				var serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
				
				if(serverSettings == null)
					return resolve();

				if(type == undefined)
					type = "get";

				$ionicLoading.show();

				var header = {
				  "alg": "HS256",
				  "typ": "JWT"
				};

				console.log(payload);
				var encodedHeader = $crypto.base64url($crypto.parseData(header));
				var encodedPayload = $crypto.base64url($crypto.parseData(payload));
				
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
				
				serverSettings = decrypted;

				var token = encodedHeader + "." + encodedPayload;
				token = $crypto.encryptHMA(token, decrypted.password);
				token = $crypto.base64url(token);
		
				var url = decrypted.serverType + '://' + decrypted.host + ':' + decrypted.port + '/'+ type +'?jwt=' + encodedHeader + '.' + encodedPayload + '.' + token;

				if(type == 'get')
				{
					$http.get(url, {timeout: 10000}).success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
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
				}
				else if(type == 'post')
				{
					$http.post(url).success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
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
			        });
				}
			});
		},

		sendLightRequest: function(params, url) {
			
			return $q(function(resolve, reject) {
				var serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
					
				if(serverSettings == null)
					return resolve();

				$ionicLoading.show();

				let encrypted = JSON.parse(localStorage.getItem('serverSettings'));
				let decrypted = {serverType:'', host:'', port:'', username: '', password: ''};

				decrypted.serverTypeLite  = $crypto.decrypt(encrypted.serverTypeLite);
				
				if(decrypted.serverTypeLite == "true")
					decrypted.serverType = 'http';
				else
					decrypted.serverType = 'https';
		  
				decrypted.host  = $crypto.decrypt(encrypted.publicGateway);

				var url = decrypted.serverType + '://' + decrypted.host + '/public?';

				var keys = Object.keys(params);
				console.log(keys);
				for (var i = keys.length - 1; i >= 0; i--) 
				{	
					console.log(keys[i]);
					url = url + keys[i] + '=' + params[keys[i]] + '&';
				}

				console.log(url);

				$http.get(url, {timeout: 10000}).success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
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
		}
	}
});