agora

.controller('ProjectsCtrl', function($scope, $state, Projects, $ionicModal, userAuth) {
  // (function(){
    // if (userAuth.isAuthenticate()) {
    $scope.newproject = [ //place holder object to get modal modal  
      { name: 'Gordon Freeman' },
      { name: 'Barney Calhoun' },
      { name: 'Lamarr the Headcrab' },
    ];

    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.createProject = function (u) {
      $scope.newproject.push({ name: u.firstName + ' ' + u.lastName });
      $scope.modal.hide();
    };

    $scope.projects = Projects.all();
    $scope.remove = function(project) {
      Projects.remove(project);
    };
    // $state.go('user.signin');

  // }

  // else{
    // $state.go('user.signin');
  // }
// })();
  
  

})

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


