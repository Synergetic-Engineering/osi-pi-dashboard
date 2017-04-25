'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('DashboardCtrl', function($scope, $state) {
    $scope.$state = $state;

    $scope.menuItems = [];
    angular.forEach($state.get(), function (item) {
        if (item.data && item.data.visible) {
            $scope.menuItems.push({name: item.name, text: item.data.text});
        }
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
    $scope.overview_line.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.overview_line.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                },
                {
                    id: 'y-axis-2',
                    type: 'linear',
                    display: true,
                    position: 'right'
                }
            ]
        }
    };

    // OVERVIEW BAR CHART
    $scope.overview_bar = {};
    $scope.overview_bar.labels = ['Kogan Creek Unit 1', 'Callide B Unit 1',  'Callide B Unit 2', 'Callide C Unit 3', 'Callide C Unit 4'];
    $scope.overview_bar.series = ['Baseline', 'Actual'];
    $scope.overview_bar.data = [
        [65, 59, 80, 56, 55],
        [28, 48, 40, 86, 27]
    ];

  });
