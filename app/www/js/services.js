agora

.factory('Projects', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data until array from api call is ready
  var projects = [{
    id: 0,
    address: '14ZNT3yQWLUpAiw6qHYENMp2dAGELhNSAE',
    goal: '1.99',
    balance: '0',
    title: 'fix_pot_holes_on_1st_st',
    category: 'PotHole: Maintenance',
    info: 'Repair both Pot Holes on 1st ST',
    url: 'http://cryptocracy.io/',
    phone: '5416703886',
    email: 'admin@cryptocracy.io',
    latitude: '',
    longitude: '',
    expire: '454545'
  }, {
    id: 1,
    address: 'none',
    goal: '0',
    balance: '0',
    title: 'found_pot_hole_on_S_1st_st',
    category: 'PotHole: Alert',
    info: 'Found a Pot hole on South 1st ST, See URL for additional details',
    url: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    expire: '454445'
  }, {
    id: 2,
    address: 'none',
    goal: '0',
    balance: '0',
    title: 'found_pot_hole_on_N_1st_st',
    category: 'PotHole: Alert',
    info: 'Found a Pot hole on North 1st ST, See URL for additional details',
    url: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    expire: '454435'
  }, {
    id: 3,
    address: '1JziA3kXQ8k5JLmdS6vRKZnwvJhRYqEJuE',
    goal: '1.15',
    balance: '0',
    title: 'fix_pot_hole_on_main_st',
    category: 'PotHole: Maintenance',
    info: 'Repair Pot hole on South side of Main ST',
    url: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    expire: '454545'
  }, {
    id: 4,
    address: 'none',
    goal: '0',
    balance: '0',
    title: 'found_pot_hole_on_S_Main_st',
    category: 'PotHole: Alert',
    info: 'Found a Pot hole on South Side of Main ST, See URL for additional details',
    url: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    expire: '454345'
  }];

  return {
    all: function() {
      return projects;
    },
    remove: function(project) {
      projects.splice(projects.indexOf(project), 1);
    },
    get: function(projectId) {
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id === parseInt(projectId)) {
          return projects[i];
        }
      }
      return null;
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
            // return "kamran";          
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
            template: 'Successfully Sign Up!',
            buttons: [{
              text:'Get Started',
              onTap: function(e) {
                // $scope.modal.hide();
                $state.go('tab.projects');
              }
            }]
          });
        }



    };
})


;