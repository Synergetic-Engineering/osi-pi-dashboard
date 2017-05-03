'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
    .controller('LoginCtrl', function($scope, $state, $localStorage, $location, $http, $rootScope) {

        // Initialise local storage and remove authorisation if it's there (make them log in again)
        $scope.$storage = $localStorage;
        if ($scope.$storage.authString) {
            delete $scope.$storage.authString;
        }
        $scope.username = '';
        $scope.password = '';

        // when they submit the login form
        $scope.submit = function(data) {
            if ($scope.username != '' && $scope.password != '') { // make sure they've entered credentials
                var authString = 'Basic '+btoa($scope.username+':'+$scope.password);
                // test to see if those credentials work
                $http.get($rootScope.baseURL, {headers: {Authorization: authString}}).then(function(response) {
                    // set up the authorisation if the credentials are valid
                    $http.defaults.headers.common.Authorization = authString;
                    $scope.$storage.authString = authString;
                    $location.path('/dashboard');
                },
                function(err){
                    // notify user if the credentials are invalid
                    $scope.errorMessage = 'Invalid credentials'
                });
                return true;
            }
            // notify user if they haven't entered credentials yet
            $scope.errorMessage = 'Please enter credentials'
            return false
        }

  });
