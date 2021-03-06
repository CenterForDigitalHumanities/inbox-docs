angular.module('inbox', ['ngRoute'])
    .controller('homeController', function($scope,$window,$location) {
        $scope.$on('$viewContentLoaded', function(event) {
            $window.ga('send', 'pageview', { page: $location.url() });
          });       
        $('.button-collapse')
            .sideNav();
        $('.parallax')
            .parallax();
        $('.collapsible')
            .collapsible();
        $('.tooltipped')
            .tooltip({
                delay: 50
            });

        function scrollToTarget(event) {
            function easeInOutQuad(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            }
            let a = event.target;
            while (a && a.tagName !== "A") {
                a = a.parentElement;
            }
            if (!$(a).hasClass("smooth")) {
                return true;
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

            function scroll() {
                const now = 'now' in window.performance ? performance.now() : new Date().getTime();
                const time = Math.min(1, ((now - startTime) / 500));
                const timeFunction = easeInOutQuad(time);
                window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
                if (Math.abs(window.pageYOffset - destinationOffsetToScroll) < 2) {
                    return;
                }
                requestAnimationFrame(scroll);
            }
            scroll();
        }
        let smooths = document.querySelectorAll('a.smooth');
        for (let item of smooths) {
            item.addEventListener('click', scrollToTarget);
        }
    })
    .controller('announcementsController', function($scope, $http, $timeout,$window,$location) {
        $scope.$on('$viewContentLoaded', function(event) {
            $window.ga('send', 'pageview', { page: $location.url() });
          });       
        $scope.$watch('uri', function() {
            let uri = $scope.uri;
            if (!uri)
                return false;
            let i = /manifest=|ur\w=/i.exec(uri);
            if (i) {
                uri = uri.substring(i.index).split("=")[1].split("&")[0];
                $scope.uri = uri;
            }
        });
        $scope.checkUri = function() {
            let uri = $scope.uri;
            if (!uri)
                return false;
            uri = 'https://inbox.rerum.io/messages?target='+uri;
            let promise = $http({
                    url: uri,
                    method: 'GET'
                })
                .then(function(res) {
                    $scope.announcements = res.data.contains;
                    $scope.empty = res.data.contains.length === 0;

                    $timeout(function() {
                        $('.tooltipped')
                            .tooltip({
                                delay: 50
                            });
                    }, 350);
                }, function() {
                    $scope.empty = true;
                });
        };
        $scope.messages = {};
        $scope.announceIt = function(form) {
            let postit = form.$$element[0];
            let announcement = {
                "@context": "https://iiif.io/api/presentation/2/context.json",
                "@type": "Announce",
                "target": postit.target_atid.value,
                "motivation": "supplementing",
                "actor": {
                    "@id": postit.actor_atid.value,
                    "label": postit.actor_label.value
                },
                "object": {
                    "@id": postit.object_atid.value,
                    "@type": postit.object_type.value,
                    "attribution": postit.object_attribution.value,
                    "description": postit.object_description.value,
                    "license": postit.object_license.value,
                    "logo": postit.object_logo.value
                },
                "published": Date.now()
            };
            let uri = 'https://inbox.rerum.io/messages';
            return $http({
                    url: uri,
                    method: 'POST',
                    data: announcement
                })
                .then(function(res) {
                    $scope.message = {
                        success: true,
                        link: res.data.name
                    };
                    form.$$element[0].reset();
                }, function() {
                    $scope.message = {
                        error: true
                    };
                    // error
                })
                .finally(function() {
                    $('#submitted').modal('open');
                });
        };

        $('#object_attribution, #object_type, #object_license, #object_logo, #object_description,#actor_label').parents('.input-field').hide();

        $scope.loady = function(field){
            if(!event.target || !event.target.value) return;
            return $http.get(event.target.value).then(function(response){
                switch(field){
                    case "target" : 
                    if(!response.data){
                        $('#target_atid').addClass('invalid');
                    } else {
                        $('#target_atid').removeClass('invalid');
                    }
                    break;
                    case "actor" :
                    if(!response.data){
                        $('#actor_atid').addClass('invalid');
                    } else {
                        $('#actor_atid').removeClass('invalid');
                    }
                    if(response.data.label){
                        $('#actor_label').val(response.data.label);
                    }
                    $('#actor_label').parents('.input-field').fadeIn(1500);
                    break;
                    case "object" :
                    if(!response.data){
                        $('#object_atid').addClass('invalid');
                        $('#object_attribution, #object_type, #object_license, #object_logo, #object_description').parents('.input-field').hide();
                    } else {
                        $('#object_atid').removeClass('invalid');
                        $('#object_attribution').val(response.data.attribution);
                        $('#object_type').val(response.data['@type']||response.data.type);
                        $('#object_license').val(response.data.license);
                        $('#object_logo').val(response.data.logo);
                        $('#object_description').val(response.data.description);
                        $('#object_attribution, #object_type, #object_license, #object_logo, #object_description').parents('.input-field').fadeIn(1500);
                    }
                    break;
                    default : break;
                }
            },
            function(){
                switch(field){
                    case "target" : 
                        $('#target_atid').addClass('invalid');
                    break;
                    case "actor" :
                        $('#actor_atid').addClass('invalid');
                        $('#actor_label').parents('.input-field').fadeIn(1500);
                    break;
                    case "object" :
                        $('#object_atid').addClass('invalid');
                        $('#object_attribution, #object_type, #object_license, #object_logo, #object_description').parents('.input-field').hide();
                    break;
                    default : break;
                }                
            });
        };
        $scope.announcement = {
            "@context": "https://iiif.io/api/presentation/2/context.json",
            "@type": "Announce",
            "target": "http://www.e-codices.ch/metadata/iiif/fcc-0020/manifest.json",
            "motivation": "supplementing",
            "actor": {
                "@id": "https://scta.info",
                "label": "SCTA"
            },
            "object": {
                "@id": "https://scta.info/iiif/lombardsententia/zbsSII72/ranges/toc/wrapper",
                "@type": "sc:Range",
                "attribution": "Data provided by the Scholastic Commentaries and Texts Archive",
                "description": "A Table of Contents for lombardsententia/zbsSII72",
                "license": "https://creativecommons.org/licenses/by-sa/4.0/",
                "logo": "https://scta.info/logo.png"
            },
            "published": "2017-08-23 20:15:52 UTC"
        };
        $('.tooltipped')
            .tooltip({
                delay: 50
            });
        $('.modal').modal();
        $('select').material_select();
    })
    .config(function($routeProvider, $httpProvider) {
        $httpProvider.defaults.useXDomain = true;

        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html',
                controller: 'homeController'
            })
            .when('/specifications', {
                templateUrl: 'partials/specifications.html',
                controller: 'homeController'
            })
            .when('/announcements', {
                templateUrl: 'partials/announcements.html',
                controller: 'announcementsController'
            })
            .when('/postit', {
                templateUrl: 'partials/postit.html',
                controller: 'announcementsController'
            })
            .otherwise({
                redirectTo: "/"
            });
    })
    .run(["$rootScope", "$anchorScroll", function($rootScope) {
        $rootScope.$on("$routeChangeSuccess", function($event, route) {
            window.scrollTo(0, 0);
            if (!route.$$route || route.$$route.templateUrl === "partials/home.html") {
                $('#logo-container')
                    .attr('href', "#top").addClass("smooth");
            } else {
                $('#logo-container')
                    .attr('href', "#!/").removeClass("smooth");
            }
        });
    }]);
$('#logo-container')
    .pushpin({
        top: 15,
        offset: 0
    });
