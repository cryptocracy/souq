// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var souq = angular.module('starter', ['ionic','ngCordova','mdo-angular-cryptography', 'monospaced.qrcode'])

.run(function($ionicPlatform, $rootScope, $state,$timeout, userAuth) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    } 
  });
})

.config(function($stateProvider, $urlRouterProvider, $cryptoProvider, $sceDelegateProvider) {

  $sceDelegateProvider.resourceUrlWhitelist(['**']);
  $cryptoProvider.setCryptographyKey('ABCD123');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
    .state('user', {
    url: '/user',
    abstract: true,
    templateUrl: 'templates/user.html'
  })

  // Each tab has its own nav history stack:

  .state('user.signin', {
    url: '/signin',
    views: {
      'user-signin': {
        templateUrl: 'templates/signin.html',
        controller: 'SigninCtrl'
      }
    }
  })
  .state('user.signup', {
    url: '/signup',
    views: {
      'user-signin': {
        templateUrl: 'templates/signup.html',
        controller: 'SigninCtrl'
      }
    }
  })
  .state('tab.account', {
    url: '/account',
    cache:false,
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.accountProject', {
    url: '/account-project/:projectId',
    cache:false,
    views: {
      'tab-account': {
        templateUrl: 'templates/project-detail.html',
        controller: 'ProjectDetailCtrl'
      }
    }
  })
  .state('tab.projects', {
      url: '/projects',
      cache:false,
      views: {
        'tab-projects': {          
          templateUrl: 'templates/tab-projects.html',
          controller: 'ProjectsCtrl'
        }
      }
    })
    .state('tab.project-detail', {
      url: '/projects/:projectId',
      views: {
        'tab-projects': {
          templateUrl: 'templates/project-detail.html',
          controller: 'ProjectDetailCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/user/signin');

})

.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
