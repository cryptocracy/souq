angular.module('starter.account', [])

.controller('AccountCtrl', function ($scope, $ionicModal) {
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
});
