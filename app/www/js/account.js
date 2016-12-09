angular.module('starter.account', [])

.controller('AccountCtrl', function ($scope, $ionicModal, $http) {
    $scope.balance = ""; // start of get for account deposit address
    $http.get('http://api.cryptocracy.io:1880/get?account=balance') // this URL needs to be reconstructed based on modal form values to set host and port
      .success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
        console.log('data sucess');
        console.log(data);
        $scope.balance = data.addresses[0].bitcoin;
      })
      .error(function(data, status, headers, config){
        console.log('data error');
      })
      .then(function(balance){
        things = balance.data;
      }); // end of deposit address get

    $scope.deposit = ""; // start of get for account deposit address
    $http.get('http://api.cryptocracy.io:1880/get?account=deposit') // this URL needs to be reconstructed based on modal form values to set host and port
      .success(function(data, status, headers, config){  // note: when testing this might encounter CORS issue, testing work arounds include ionic run or a chrome ext
        console.log('data sucess');
        console.log(data);
        $scope.deposit = data;
      })
      .error(function(data, status, headers, config){
        console.log('data error');
      })
      .then(function(deposit){
        things = deposit.data;
      }); // end of deposit address get


    $scope.contacts = [ //crap modal place holder for modal use
      { name: 'Gordon Freeman' },
      { name: 'Barney Calhoun' },
      { name: 'Lamarr the Headcrab' },
    ];

    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.createContact = function (u) {
        $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
        $scope.modal.hide();
    }; //end of crap place holder
})
