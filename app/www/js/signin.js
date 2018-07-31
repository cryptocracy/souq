souq
.controller('SigninCtrl', function ($scope, $state, $crypto, userAuth, errorPopup) {
	console.log("Welcome to SigninCtrl")
	
	let tmp = localStorage.getItem('user');
	if (tmp)
		$scope.show = false;
	else
		$scope.show = true;

	$scope.signin = function(user) {
		if (!user)
			return;

		if (user.name != "" || user.pass != "") 
		{
			let decrypted = {name:'', pass:''};
			let encrypted;
			encrypted = JSON.parse(localStorage.getItem('user'));
			decrypted.name  = $crypto.decrypt(encrypted.uname);
			decrypted.pass  = $crypto.decrypt(encrypted.pass);
			
			if (decrypted.name == user.name && decrypted.pass == user.pass) 
			{
				$state.go('tab.account');
				localStorage.setItem('userLogin', JSON.stringify(true));
				console.log(userAuth.isAuthenticate());				
			}
			else {
				alert('Try Again!!')
			}
		}
		else {
			errorPopup.emptyField();
			console.log('Empty Fields');
		}
	}

	var let = { uname: "", pass: "", confirmPass:"" }

	$scope.signup = function(user) 
	{
				
		if(user != undefined)
		{

			if((user.uname != undefined || user.uname != null) && 
				(user.pass != undefined || user.pass != null) && 
				(user.confirmPass != undefined || user.confirmPass != null))
			{		
				if(user.uname && (user.pass == user.confirmPass))
				{
					user.uname = $crypto.encrypt(user.uname);
					user.pass = $crypto.encrypt(user.pass);
					user.confirmPass = $crypto.encrypt(user.confirmPass);
					localStorage.setItem('user', JSON.stringify(user));	
					localStorage.setItem('userLogin', JSON.stringify(true));

					//save default server settings
					var serverData = {};
					serverData.serverType = $crypto.encrypt("true");
					serverData.host = $crypto.encrypt("");
					serverData.port = $crypto.encrypt("");
					serverData.password = $crypto.encrypt("");
					serverData.serverTypeLite = $crypto.encrypt("true");
					serverData.publicGateway = $crypto.encrypt("bns.cryptocracy.io");
					localStorage.setItem('serverSettings', JSON.stringify(serverData));

					errorPopup.passwordMatchSuccess();
					user.uname = "";
					user.pass = "";
					user.confirmPass = "";
				}
				else
					errorPopup.passwordMatch();
			}
			else
				errorPopup.emptyField();
		}
		else
			errorPopup.emptyField();
	}
});