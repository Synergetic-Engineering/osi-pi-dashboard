'use strict';

/**
 * @ngdoc overview
 * @name yapp
 * @description
 * # yapp
 *
 * Main module of the application.
 */
var states = [
        { name: 'base', state: { abstract: true, url: '', templateUrl: 'views/base.html', data: {text: "Base", visible: false } } },
        { name: 'login', state: { url: '/login', parent: 'base', templateUrl: 'views/login.html', controller: 'LoginCtrl', data: {text: "Login", visible: false } } },
        { name: 'dashboard', state: { url: '/dashboard', parent: 'base', templateUrl: 'views/dashboard.html', controller: 'DashboardCtrl', data: {text: "Dashboard", visible: false } } },
        { name: 'overview', state: { url: '/overview', parent: 'dashboard', templateUrl: 'views/dashboard/overview.html', data: {text: "Overview", visible: true } } },
        { name: 'kogancreek', state: { url: '/kogancreek', parent: 'dashboard', templateUrl: 'views/dashboard/unit-report.html', data: {text: "Kogan Creek", visible: true } } },
        { name: 'callidebunit1', state: { url: '/callideb-unit1', parent: 'dashboard', templateUrl: 'views/dashboard/unit-report.html', data: {text: "Callide B Unit 1", visible: true } } },
        { name: 'callidebunit2', state: { url: '/callideb-unit2', parent: 'dashboard', templateUrl: 'views/dashboard/unit-report.html', data: {text: "Callide B Unit 2", visible: true } } },
        { name: 'callidecunit3', state: { url: '/callidec-unit3', parent: 'dashboard', templateUrl: 'views/dashboard/unit-report.html', data: {text: "Callide C Unit 3", visible: true } } },
        { name: 'callidecunit4', state: { url: '/callidec-unit4', parent: 'dashboard', templateUrl: 'views/dashboard/unit-report.html', data: {text: "Callide C Unit 4", visible: true } } },
        { name: 'logout', state: { url: '/login', data: {text: "Logout", visible: true }} }
    ];

angular.module('yapp', [
                'ui.router',
                'snap',
                'ngAnimate',
                'chart.js',
                'ngStorage'
            ])
        .config(function($stateProvider, $urlRouterProvider) {
            // go to the overview dashboard by default (/dashboard doesn't actually exist as a concrete page)
            $urlRouterProvider.when('/dashboard', '/dashboard/overview');
            $urlRouterProvider.otherwise('/dashboard/overview');

            // set up ui router states
            angular.forEach(states, function (state) {
                $stateProvider.state(state.name, state.state);
            });
        })
        .run(function($rootScope) {
            // CONFIG global base url of pi web api server
            $rootScope.baseURL = "https://pisrv/piwebapi/";
            // CONFIG colour of chart font (for easier readability on dark blue backgroud)
            Chart.defaults.global.defaultFontColor = "#eee"
        }
        );
