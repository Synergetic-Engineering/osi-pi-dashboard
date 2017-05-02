'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
    .controller('DashboardCtrl', function($scope, $state, $localStorage, $location, $http, $rootScope) {

        $scope.$storage = $localStorage;

        if ($scope.$storage.authString) {
            $http.defaults.headers.common.Authorization = $scope.$storage.authString;
            $http.get($rootScope.baseURL).error(function(err) {
                $location.path('/login');
            });
        } else {
            $location.path('/login');
        }

        $scope.$state = $state;

        $scope.menuItems = [];
        angular.forEach($state.get(), function (item) {
            if (item.data && item.data.visible) {
                $scope.menuItems.push({name: item.name, text: item.data.text});
            }
        });

        if ($state.current.name == 'overview') {

            $http.get(
                $rootScope.baseURL+"streams/A0EjjfaXGAdYE6dRmUoyz-i0AWqo4w5LF5hG2smDYGbNgkwglDWoXPlZVcczbhOCXz_7QUElTUlZcU0FNUyBUUkFJTklOR1xHRU5FUkFUSU9OQVNTRVRTXEtPR0FOQ1JFRUt8TE9BRA/interpolated?starttime=*-2h&stoptime=*"
            ).then(function(response) {
                console.log(response.data.Items);
            });

            // OVERVIEW LINE CHART
            $scope.overview_line = {};
            $scope.overview_line.labels = ["January", "February", "March", "April", "May", "June", "July"];
            $scope.overview_line.series = ['Kogan Creek Unit 1', 'Callide B Unit 1', 'Callide B Unit 2', 'Callide C Unit 3', 'Callide C Unit 4'];
            $scope.overview_line.data = [
                [65, 59, 80, 81, 56, 55, 40],
                [28, 48, 40, 59, 86, 27, 90],
                [24, 28, 20, 59, 36, 17, 50],
                [25, 88, 40, 59, 56, 47, 30],
                [42, 38, 50, 59, 66, 37, 30]
            ];
            $scope.overview_line.onClick = function (points, evt) {
                console.log(points, evt);
            };

            // OVERVIEW BAR CHART
            $scope.overview_bar = {};
            $scope.overview_bar.labels = ['Kogan Creek Unit 1', 'Callide B Unit 1',  'Callide B Unit 2', 'Callide C Unit 3', 'Callide C Unit 4'];
            $scope.overview_bar.series = ['Baseline', 'Actual'];
            $scope.overview_bar.data = [
                [65, 59, 80, 56, 55],
                [28, 48, 40, 86, 27]
            ];

            $scope.populateOverview = function() {
                $http({method : 'GET',url : '...', headers: { 'X-Parse-Application-Id':'XXX', 'X-Parse-REST-API-Key':'YYY'}})
                    .success(function(data, status) {
                        $scope.items = data;
                    })
                    .error(function(data, status) {
                        alert("Error");
                    });
            };

        } else {
            if ($state.current.name == 'kogancreek') {

            } else if ($state.current.name == 'callideb-unit1') {

            } else if ($state.current.name == 'callideb-unit2') {

            } else if ($state.current.name == 'callidec-unit3') {

            } else if ($state.current.name == 'callidec-unit4') {

            };
        };

});
