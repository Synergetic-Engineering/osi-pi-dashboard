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
        console.log($state.current.name)
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                console.log('state change', event, toState.name)
                $scope.updateDashboard(toState.name)
            });

        $scope.menuItems = [];
        angular.forEach($state.get(), function (item) {
            if (item.data && item.data.visible) {
                $scope.menuItems.push({name: item.name, text: item.data.text});
            }
        });

        $scope.sites = {}
        $scope.sites.kogancreek = {
            reportname: 'kogancreek',
            longname: 'Kogan Creek Unit 1',
            shortname: 'KCk',
            description: 'Single 750MW unit Supercritical Coal-Fired Power Station',
            hidden: false,
            loadWebID: 'A0EjjfaXGAdYE6dRmUoyz-i0AAxcTtZLF5hG2smDYGbNgkwI3orefTQQlMNjDU9R9YgGwUElTUlZcU0FNUyBUUkFJTklOR1xHRU5FUkFUSU9OQVNTRVRTXEtPR0FOQ1JFRUtcVU5JVDF8TE9BRA',
            turbAssetWebID: 'E0jjfaXGAdYE6dRmUoyz-i0AqHabVJLF5hG2smDYGbNgkwUElTUlZcU0FNUyBUUkFJTklOR1xHRU5FUkFUSU9OQVNTRVRTXEtPR0FOQ1JFRUtcVU5JVDFcVFVSQg',
        };
        //[, 'Callide B Unit 1', 'Callide B Unit 2', 'Callide C Unit 3', 'Callide C Unit 4'];

        if (!$scope.$storage.startTime) $scope.$storage.startTime = 'Today-1d'
        if (!$scope.$storage.endTime) $scope.$storage.endTime = '*'

        $scope.updateOverview = function() {
            var timequery='?startTime='+$scope.$storage.startTime+'&endTime='+$scope.$storage.endTime+'&interval=1h';

            // OVERVIEW LINE CHART
            $scope.overview_line = {};
            $scope.overview_line.labels = [];
            $scope.overview_line.series = [];
            $scope.overview_line.data = [];
            for (var site in $scope.sites) {
                if (!$scope.sites[site].hidden) {
                    $http.get(
                        $rootScope.baseURL+'streams/'+$scope.sites[site].loadWebID+'/interpolated'+timequery
                    ).then(function(response) {
                        $scope.overview_line.series.push($scope.sites[site].longname)
                        var values = [];
                        var times = [];
                        for (var i = 0; i < response.data.Items.length; i++) {
                            var time = moment(response.data.Items[i].Timestamp).format('MMM D YYYY, HH:mm');
                            values.push(response.data.Items[i].Value);
                            times.push(time)
                            //console.log(time, response.data.Items[i].Value);
                        }
                        $scope.overview_line.data.push(values);
                        $scope.overview_line.labels = times;
                    });
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

        }

        $scope.updateSiteReport = function(site) {
            console.log(site, $scope.sites)
            if (!$scope.sites.hasOwnProperty(site)) {
                $state.go('overview');
                return false;
            }
            var timequery='?startTime='+$scope.$storage.startTime+'&endTime='+$scope.$storage.endTime+'&interval=1h';

            $scope.currentSite = site;
            $scope.cascade_heaters = {}
            $scope.cascade_heater_report_line = {};
            $scope.cascade_heater_report_line.labels = [];
            $scope.cascade_heater_report_line.series = [];
            $scope.cascade_heater_report_line.data = [];


            $http.get($rootScope.baseURL+'elements/'+$scope.sites[site].turbAssetWebID+'/elements').then(function(elementres) {
                for (let cascade_heater in elementres.data.Items) {
                    cascade_heater = elementres.data.Items[cascade_heater]
                    if (cascade_heater.TemplateName != 'CascadeHeater') continue;
                    $scope.cascade_heaters[cascade_heater.Name] = cascade_heater
                    $scope.cascade_heaters[cascade_heater.Name].log = [];
                    $scope.cascade_heaters[cascade_heater.Name].showLog = false;
                    $scope.cascade_heaters[cascade_heater.Name].new_comment = '';

                    $http.get(cascade_heater.Links.Attributes).then(function(attributeres) {
                        for (let attribute in attributeres.data.Items) {
                            attribute = attributeres.data.Items[attribute]
                            if (attribute.Name == 'ttd') {
                                var series_name = attribute.Path.split('\\').slice(-1).pop().split('|').join(' ');
                                $http.get(attribute.Links.InterpolatedData+timequery).then(function(response) {
                                    $scope.cascade_heater_report_line.series.push(series_name);
                                    var values = [];
                                    var times = [];
                                    for (var i = 0; i < response.data.Items.length; i++) {
                                        var time = moment(response.data.Items[i].Timestamp).format('MMM D YYYY, HH:mm');
                                        values.push(response.data.Items[i].Value);
                                        times.push(time)
                                        //console.log(time, response.data.Items[i].Value);
                                    }
                                    $scope.cascade_heater_report_line.data.push(values);
                                    $scope.cascade_heater_report_line.labels = times;
                                });
                            } else if (attribute.Name == 'comments') {

                                $scope.cascade_heaters[cascade_heater.Name].logComment = function() {
                                    if ($scope.cascade_heaters[cascade_heater.Name].new_comment == '') return false;

                                    $http.post(
                                        $rootScope.baseURL+'streams/'+attribute.WebId+'/value',
                                        JSON.stringify({'Value': $scope.cascade_heaters[cascade_heater.Name].new_comment})
                                    ).then(function(response) {
                                        $scope.cascade_heaters[cascade_heater.Name].log.unshift({
                                            time: moment().format('MMM D YYYY, HH:mm'),
                                            comment: $scope.cascade_heaters[cascade_heater.Name].new_comment
                                        });
                                    })
                                }

                                $http.get(attribute.Links.RecordedData+timequery+"&maxCount=10").then(function(response) {
                                    var values = [];
                                    for (var i = 0; i < response.data.Items.length; i++) {
                                        if (typeof response.data.Items[i].Value === 'string') {
                                            values.push({
                                                time: moment(response.data.Items[i].Timestamp).format('MMM D YYYY, HH:mm'),
                                                comment: response.data.Items[i].Value
                                            });
                                        }
                                    }
                                    $scope.cascade_heaters[cascade_heater.Name].log = values.reverse();
                                });
                            };
                        }
                    })
                }
            })
        }

        $scope.updateDashboard = function(statename) {
            if (statename == 'overview') {
                $scope.updateOverview();
            } else {
                $scope.updateSiteReport(statename);
            };
        }
        $scope.updateDashboard($state.current.name)

});
