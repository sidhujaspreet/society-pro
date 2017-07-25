(function(){
    'use strict';

    angular
        .module('societyPro.sproServices', [])
        .service('sproHelperFunctionSvc', sproHelperFunctionSvc)
        .service('sproMarkerSvc', sproMarkerSvc)
        .service('sproApiCallsSvc', sproApiCallsSvc);
    
    sproMarkerSvc.$inject = ['sproHelperFunctionSvc'];
    sproApiCallsSvc.$inject = ['$http','sproMarkerSvc'];
    
    //--------------------helperFunctionService Service-----------------------//
        function sproHelperFunctionSvc(){
            this.clearMarker = function () {
                    //$scope.marker.setmapMap(null);
                    var marker = null;
                };
            this.updateRightPanel = function(selectedInfo) {
                var selectedService = {
                    "id" : selectedInfo.id,
                    "name" : selectedInfo.name,
                    "description" : selectedInfo.description,
                    "contactNo" : selectedInfo.contactInfo.phone.primary
                };
            };
        };

    //--------------------markerService Service-----------------------//
        function sproMarkerSvc(sproHelperFunctionSvc){
            this.createMarker = function(info, circle, mapObj) {
                var markerPosition = new google.maps.LatLng(info.location.latitude, info.location.longitude);
                var distance = google.maps.geometry.spherical.computeDistanceBetween(markerPosition, circle.center)
                if(distance <= circle.radius)
                    {
                        var marker = new google.maps.Marker({
                            map: mapObj,
                            position: new google.maps.LatLng(info.location.latitude, info.location.longitude),
                            title: info.name,
                            content: '<div class="infoWindowContent">ID : ' + info.id + '<br />Name : ' + info.name + '<br />Description : ' + info.description + '<br />Contact No. : ' + info.contactInfo.phone.primary + '</div>'
                        });

                    var infoWindow = new google.maps.InfoWindow();
                    google.maps.event.addListener(marker, 'click', function () {
                        //sproHelperFunctionSvc.updateRightPanel(info);
                        mapObj.setCenter(new google.maps.LatLng(info.location.latitude, info.location.longitude));
                        if (infoWindow) {
                            infoWindow.close();
                        }
                        infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                        infoWindow.open(mapObj, marker);
                    });
                    this.markers.push(marker);
                    return this.markers;
                }
            }; 
         };
    
     //--------------------sproApiCallsSvc Service-----------------------//
        function sproApiCallsSvc($http, sproMarkerSvc){
            this.getServiceResults = function(serviceName, circle, mapObj){
                if(serviceName)
                    {
                     $http.get('/servicelist/'+serviceName).success(function(response){
                         console.log("I got the data I requested.");
                         var data = response;
                         angular.forEach(sproMarkerSvc.markers, function(value, key){
                             value.setMap(null);
                         });
                         sproMarkerSvc.markers = [];
                         angular.forEach(data, function(value, key){
                            sproMarkerSvc.createMarker(value, circle, mapObj);
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
        };
})();