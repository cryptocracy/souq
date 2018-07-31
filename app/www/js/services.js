souq

.factory('Projects', function($crypto, $http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data until array from api call is ready
  var projects = [{
    id: 0,
    address: '14ZNT3yQWLUpAiw6qHYENMp2dAGELhNSAE',
    goal: '1.99',
    balance: '0',
    title: 'fix_pot_holes_on_1st_st',
    category: 'Infrastructural',
    info: 'Here is the details about my project',
    url: 'http://cryptocracy.io/',
    phone: '5416703886',
    email: 'admin@cryptocracy.io',
    latitude: '',
    longitude: '',
    expire: '441777'
  }, {
    id: 1,
    address: '1nybV3p2xE1fVi8aVwxnPpgfqH2KqWGzS',
    goal: '3.59',
    balance: '0',
    title: '2017_school_supplies_for_4th_graders Obaid',
    category: 'Educational',
    info: 'School supplies for the 4th graders',
    url: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    expire: '441856'
  }, {
    id: 2,
    address: '1C7Pkm2ExNbqwpEui9gQU6UCr8KLJCTTtq',
    goal: '1.55',
    balance: '0',
    title: 'get_tractor_for_community_farm',
    category: 'Agricultural',
    info: 'Get tractor for community farm',
    url: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    expire: '441916'
  }, {
    id: 3,
    address: '1JziA3kXQ8k5JLmdS6vRKZnwvJhRYqEJuE',
    goal: '30.15',
    balance: '0',
    title: 'repair_bridge_on_se_1st',
    category: 'Infrastructural',
    info: 'Repair bridge on SE 1st',
    url: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    expire: '441955'
  }, {
    id: 4,
    address: '1PW6ySd7bzHYsWDB4nRz4yvf3PtBZX7vY6',
    goal: '5.55',
    balance: '0',
    title: 'dental_exams_for_community_for_month',
    category: 'HealthCare',
    info: 'Free Dental Exams for community for month',
    url: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    expire: '441999'
  }];

  return {
    all: function() {
      return projects;
    },
    remove: function(project) {
      projects.splice(projects.indexOf(project), 1);
    },
    get: function(projectId) {
      
    }
  };
})



// Service for user Authentication and user logout

.factory('userAuth', function($state){
  return{
    isAuthenticate: function(){ // checking login condition
      var auth =  JSON.parse(localStorage.getItem('userLogin'));  
      if(auth == "true"){
        auth = true;
        return auth;
      }
      else{
        auth = false;
        return auth;
      }
    },
    userLogout: function(){ // logging out user
      localStorage.setItem('userLogin', JSON.stringify(false));
      $state.go('user.signin');
    }
  };
})

.factory('errorPopup', function($ionicPopup, $state){
  return{
    signinError: function(){
        $ionicPopup.alert({
        title: 'Login Error!',
        template: 'User or Password is Invalid!!',
        buttons: [{
          text:'OK',
          onTap: function(e) {
            // $scope.modal.hide();
          }
        }]
      });
    },
    emptyField: function(){
        $ionicPopup.alert({
        title: 'Empty Field!',
        template: 'Fill Out All Fields!',
        buttons: [{
          text:'OK',
          onTap: function(e) {
            // $scope.modal.hide();
          }
        }]
      });
    },
    passwordMatch: function(){
        $ionicPopup.alert({
        title: 'Password Error!',
        template: 'Password not match!',
        buttons: [{
          text:'OK',
          onTap: function(e) {
            // $scope.modal.hide();
          }
        }]
      });
    },
    passwordMatchSuccess: function(){
        $ionicPopup.alert({
        title: 'Successful',
        template: 'Successfully Created Lock!',
        buttons: [{
          text:'Get Started',
          onTap: function(e) {
            // $scope.modal.hide();
            $state.go('tab.account');
          }
        }]
      });
    }
  };
});