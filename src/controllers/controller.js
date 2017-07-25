var app = angular.module('myApp', []);

app.controller('ctrl', ['$scope', 'apiCallsService', 'markerService', function ($scope, apiCallsService, markerService) {
    
    //----------------Scope Variables----------------//
    
    //---------------Left Panel List---------------//
    $scope.serviceNames = [{ 
            "Key": "Gym",
            "Value": "gyms"
        }, {
            "Key": "Swimming",
            "Value": "swimming"
        }, {
            "Key": "Coaching",
            "Value": "coaching"
        }, {
            "Key": "Ground",
            "Value": "ground"
        }, {
            "Key": "Police Station",
            "Value": "policestation"
        }, {
            "Key": "Restaurant",
            "Value": "restaurant"
        }, {
            "Key": "Pub",
            "Value": "pub"
        }];

        $scope.selectedService = {
            "id" : "sda",
            "name" :  "v dsv",
            "description" :  "cvdscf",
            "contactNo" :  ""
        };

        //------------------Onload functions-------------------//
        $scope.mapOptions = {
            zoom: 5,
            center: new google.maps.LatLng(21.0000, 78.0000),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        $scope.map = new google.maps.Map(document.getElementById('mapBody'), $scope.mapOptions);
        var infoWindow = new google.maps.InfoWindow();
        $scope.markers = [];

        //apiCallsService.getServiceResults();

        //----------------Search function------------------//
        $scope.doSearch = function(service){
            if($scope.location === ''){
                alert('Directive did not update the location property in parent controller.');
            } else {
                $scope.mapOptions = {
                    zoom: 9,
                    center: new google.maps.LatLng($scope.location.latitude, $scope.location.longitude),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                $scope.map = new google.maps.Map(document.getElementById('mapBody'), $scope.mapOptions);

            //----------------Draw circle-------------------//
            $scope.circle = new google.maps.Circle({
                  center: new google.maps.LatLng($scope.location.latitude, $scope.location.longitude),
                  radius: 20000,
                  map: $scope.map,
                  fillColor: '#B3E8FF',
                  fillOpacity: 0,
                  strokeColor: '#B3E8FF',
                  strokeOpacity: 1
                });
                $scope.map.fitBounds($scope.circle.getBounds());
                apiCallsService.getServiceResults(service, $scope.circle);
            }
        };
    
        $scope.map = markerService.maps;
        $scope.markers = markerService.markers;
}]);

//==================================================================================================================================================//
//==================================================================================================================================================//
    //--------------------markerService Service-----------------------//
        app.service('markerService', ['helperFunctionService', function(helperFunctionService){
                            //=------------Create Marker--------------=//
            this.createMarker = function(info, circle) {
                this.markers = [];
                //console.log("From CreateMarker New "+info.location);
                var distance = google.maps.geometry.spherical.computeDistanceBetween((new google.maps.LatLng(info.location.latitude, info.location.longitude)), circle.center);
                //console.log("id : "+ info.id +" lat : " + info.location.latitude + " lng : " + info.location.longitude);
                //console.log("dist : " + distance + " radius : " + circle.radius);
                if(distance <= circle.radius)
                    {
                        var marker = new google.maps.Marker({
                            map: this.map,
                            position: new google.maps.LatLng(info.location.latitude, info.location.longitude),
                            title: info.name,
                            content: '<div class="infoWindowContent">ID : ' + info.id + '<br />Name : ' + info.name + '<br />Description : ' + info.description + '<br />Contact No. : ' + info.contactInfo.phone.primary + '</div>'
                        });

                    google.maps.event.addListener(marker, 'click', function () {
                        helperFunctionService.updateRightPanel(info);
                        this.map.setCenter(new google.maps.LatLng(info.location.latitude, info.location.longitude));
                        this.map.setZoom(12);

                        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                        infoWindow.open(map, marker);
                    });
                    //console.log("marker val : " + marker.position);
                    this.markers.push(marker);
                }
            }; 
         }]);

//==================================================================================================================================================//
//==================================================================================================================================================//
        //--------------------apiCalls Service-----------------------//
        app.service('apiCallsService', ['$http','markerService', function($http, markerService){
            //------------API calls----------------//
            this.getServiceResults = function(service, circle){
                console.log(service);
                if(service)
                    {
                     $http.get('/servicelist/'+service).success(function(response){
                         console.log("I got the data I requested.");
                         var gymData = response;
                         
                         //if ($scope.marker !== null) {
                        //        $scope.clearMarker();
                          //  }
                         angular.forEach(gymData, function(value, key){
                            markerService.createMarker(value, circle);
                         });
                    });
                 }
            };
            
            this.fa = "";
            
            this.addGym = function(){
                console.log($scope.fa);
                $http.post('/servicelist',$scope.fa).success(function(response) {
                 console.log(response);
                getServiceResults();
                });
            };

            this.remove = function(id){
              console.log(id);
                $http.delete('/servicelist/'+id).success(function(response) {
                 console.log(response);
                getServiceResults();
                });
            };

            this.edit = function(id){
              console.log(id);
                $http.get('/servicelist/'+id).success(function(response) {
                    $scope.fa = response;
                 console.log(response);
                });
            };

            this.update = function(){
              console.log($scope.fa._id);
                $http.put('/servicelist/'+$scope.fa._id, $scope.fa).success(function(response) {
                 console.log(response);
                getServiceResults();
                });
            };
            //---------------API calls ends---------------//
        }]);

//==================================================================================================================================================//
//==================================================================================================================================================//

    //--------------------helperFunctionService Service-----------------------//
        app.service('helperFunctionService', function(){
            //-------------------Clear Marker---------------------//
            this.clearMarker = function () {
                    //$scope.marker.setmapMap(null);
                    var marker = null;
                };
                //------------------Update object-------------------//
            this.updateRightPanel = function(selectedInfo) {
                var selectedService = {
                    "id" : selectedInfo.id,
                    "name" : selectedInfo.name,
                    "description" : selectedInfo.description,
                    "contactNo" : selectedInfo.contactInfo.phone.primary
                };
            };
        });

//==================================================================================================================================================//
//==================================================================================================================================================//

        //--------------Custom directives ----------------//
        app.directive('googlePlaces', function(){
                return {
                    restrict:'EA',
                    replace:true,
                    // transclude:true,
                    scope: {location:'='},
                    template: '<input id="google_places_ac" name="google_places_ac" type="text" class="form-control" placeholder="Enter City">',
                    link: function($scope, elm, attrs){
                        var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
                        google.maps.event.addListener(autocomplete, 'place_changed', function() {
                            var place = autocomplete.getPlace();
                            $scope.location = {
                                "latitude" : place.geometry.location.lat(),
                                "longitude" : place.geometry.location.lng()
                            };
                            $scope.$apply();
                        });
                    }
                }
            });
        

        app.directive('rightPanel', function() {
            return { 
                restrict:'EA',
                    replace:true,
                    // transclude:true,
                    scope: {
                        selectedService:'='
                    },
                    template: '<div>'+'{{selectedService}}<br />'+'{{selectedService.id}}<br />'+'{{selectedService.name}}<br />'+'{{selectedService.description}}<br />'+'</div>',
                    link: function($scope, elm, attrs){
                    }
            };
        });
        //--------------Custom directives ends----------------//

//==================================================================================================================================================//
//==================================================================================================================================================//