souq.factory('lightModeFactory', function($crypto, $http, $ionicLoading, $ionicPopup, $q, requestService) {

	return {
	
      	searchProjects: function(searchType, data) 
		{
			console.log(searchType);
			console.log(data);
			
			return $q(function(resolve, reject) {

				switch (searchType) 
				{
		            case 1:
		                if(data.longitude == '')
					        data.longitude = 0;
					    if(data.latitude == '')
					        data.latitude = 0;
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
					        data.keyword = 0;
					    if (data.category == '')
					        data.category = 0;
					    if (data.type == '')
					        data.type = 0;
					    if (data.detail == '')
					        data.detail = 0;
					    if (data.phone == '')
					        data.phone = 0;
					    if (data.email == '')
					        data.email = 0;
					    if (data.website == '')
					        data.website = 0;
					    if (data.address == '')
					        data.address = 0;
					    if (data.stage == '')
					        data.stage = 0;

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
					        "stage":data.stage,
					        "admin":true
				      	};

		                break;

		            case 3:
		            	if (data.projectId == '')
	        				data.projectId = 0;

	        			var payload = {
					        "method": "get",
					        "request": "lookup",
					        "id": data.projectId,
					        "admin": true
					    };

		            	break;
	        	}

	        	console.log(payload);
	        	requestService.sendLightRequest(payload).then(function(data){
					return resolve(data);
				}).catch(function(error){
					return reject(error);
				});
			});
		},

		getDetails: function(projectId) {

			return $q(function(resolve, reject) {

				var serverSettings = JSON.parse(localStorage.getItem('serverSettings'));
				if(serverSettings == null)
					return resolve();

				var payload = {
				  "method": "get",
				  "request": "lookup",
				  "id": projectId,
				  "admin": false
				};

				requestService.sendLightRequest(payload).then(function(data){
					return resolve(data);
				}).catch(function(error){
					return reject(error);
				});
			});
		}
    };

});