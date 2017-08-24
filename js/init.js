angular.module('inbox',['ngRoute'])
    .controller('homeController', function($scope){
    $('.button-collapse').sideNav();
    $('.parallax').parallax();
})
.config(function($routeProvider, $locationProvider){
    $routeProvider
    .when('/',{
        templateUrl: 'partials/home.html',
        controller: 'homeController'
    })
        .when('/announcements',{
            templateUrl: 'partials/announcements.html',
        controller: 'homeController',
    resolve: {
      // I will cause a 1 second delay
      delay: function($q, $timeout) {
        var delay = $q.defer();
        $timeout(delay.resolve, 1000);
        return delay.promise;
      }
    }
    });
})
;