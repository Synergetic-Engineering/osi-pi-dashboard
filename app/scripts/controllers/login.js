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

        $scope.$storage = $localStorage;
        if ($scope.$storage.authString) {
            delete $scope.$storage.authString;
        }

        $scope.username = '';
        $scope.password = '';

        $scope.submit = function(data) {
            if ($scope.username != '' && $scope.password != '') {
                var authString = 'Basic '+btoa($scope.username+':'+$scope.password);
                $http.get($rootScope.baseURL, {headers: {Authorization: authString}}).then(function(response) {
                    $http.defaults.headers.common.Authorization = authString;
                    $scope.$storage.authString = authString;
                    $location.path('/dashboard');
                },
                function(err){
                    $scope.errorMessage = 'Invalid credentials'
                });
                return true;
            }
            $scope.errorMessage = 'Please enter credentials'
            return false
        }

  });
