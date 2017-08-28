angular.module('inbox',['ngRoute'])
    .controller('homeController', function($scope){
    $('.button-collapse').sideNav();
    $('.parallax').parallax();

    $('.tooltipped').tooltip({delay: 50});

            function scrollTo (event) {
                function easeInOutQuad (t) {
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                }
                let a = event.target;
                while (a && a.tagName !== "A") {
                    a = a.parentElement;
                }
                let hash = a.hash;
                event.preventDefault();
                let target = document.getElementById(hash.substring(1));
                // target.scrollIntoView({ behavior: 'smooth'});

                const start = window.pageYOffset;
                const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

                const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
                const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
                const destinationOffset = target.offsetTop;
                const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

                if ('requestAnimationFrame' in window === false) {
                    window.scroll(0, destinationOffsetToScroll);
                    return;
                }

                function scroll () {
                    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
                    const time = Math.min(1, ((now - startTime) / 500));
                    const timeFunction = easeInOutQuad(time);
                    window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));

                    if (window.pageYOffset === destinationOffsetToScroll) {
                        return;
                    }
                    requestAnimationFrame(scroll);
                }
                scroll();
            }
            let smooths = document.querySelectorAll('a.smooth');
            for (let item of smooths) {
                item.addEventListener('click', scrollTo);
            }


})
    .controller('announcementsController',function($scope,$http,$timeout){
        $scope.checkUri = function(){
            let uri = $scope.uri;
            if (!uri) return false;
            uri = 'http://jpcloudusa015.nshostserver.net:33106/inbox/messages?target='+uri;
//            uri = 'https://rerum-inbox.firebaseio.com/messages.json?orderBy="target"&equalTo="'+uri+'"';
            let promise = $http({
                url:uri,
                method:'GET'
            })
                .then(function(res){
                    $scope.announcements = res.data.contains;
                    $scope.empty = res.data.contains.length===0;

                $timeout(function(){        $('.tooltipped').tooltip({delay: 50});
                    },350);
            }, function(){
                $scope.empty = true;
            });
        };
        $scope.announcement = {
    "@context":"https://iiif.io/api/presentation/2/context.json",
    "@type":"Announce",
    "target":"http://www.e-codices.ch/metadata/iiif/fcc-0020/manifest.json",
    "motivation":"supplementing",
    "actor":{"@id":"https://scta.info","label":"SCTA"},
    "object":{"@id":"https://scta.info/iiif/lombardsententia/zbsSII72/ranges/toc/wrapper",
        "@type":"sc:Range",
        "attribution":"Data provided by the Scholastic Commentaries and Texts Archive",
        "description":"A Table of Contents for lombardsententia/zbsSII72",
        "license":"https://creativecommons.org/licenses/by-sa/4.0/",
        "logo":"https://scta.info/logo.png"},
    "published":"2017-08-23 20:15:52 UTC"
};
        $('.tooltipped').tooltip({delay: 50});
})
.config(function($routeProvider, $locationProvider, $httpProvider){
    $httpProvider.defaults.useXDomain = true;

    $routeProvider
    .when('/',{
        templateUrl: 'partials/home.html',
        controller: 'homeController'
    })
        .when('/boop',{
        template: '<div>boop</div>',
        controller: 'homeController'
    })
        .when('/announcements',{
            templateUrl: 'partials/announcements.html',
        controller: 'announcementsController'
    })
        .otherwise({
            redirectTo: "/"
        });
})
;