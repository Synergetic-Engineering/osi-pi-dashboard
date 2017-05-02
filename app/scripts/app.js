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
        { name: 'kogancreek', state: { url: '/kogancreek', parent: 'dashboard', templateUrl: 'views/dashboard/kogancreek.html', data: {text: "Kogan Creek", visible: true } } },
        { name: 'callideb-unit1', state: { url: '/callideb-unit1', parent: 'dashboard', templateUrl: 'views/dashboard/callideb-unit1.html', data: {text: "Callide B Unit 1", visible: true } } },
        { name: 'callideb-unit2', state: { url: '/callideb-unit2', parent: 'dashboard', templateUrl: 'views/dashboard/callideb-unit2.html', data: {text: "Callide B Unit 2", visible: true } } },
        { name: 'callidec-unit3', state: { url: '/callidec-unit3', parent: 'dashboard', templateUrl: 'views/dashboard/callidec-unit3.html', data: {text: "Callide C Unit 3", visible: true } } },
        { name: 'callidec-unit4', state: { url: '/callidec-unit4', parent: 'dashboard', templateUrl: 'views/dashboard/callidec-unit4.html', data: {text: "Callide C Unit 4", visible: true } } },
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
            $urlRouterProvider.when('/dashboard', '/dashboard/overview');
            $urlRouterProvider.otherwise('/dashboard');

            angular.forEach(states, function (state) {
                $stateProvider.state(state.name, state.state);
            });
        })
        .run(function($rootScope) {
            $rootScope.baseURL = "https://pisrv/piwebapi/";
        }
        );
