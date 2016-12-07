angular.module('starter.controllers', [])


.controller('ProjectsCtrl', function($scope, Projects, $ionicModal) {
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
});
