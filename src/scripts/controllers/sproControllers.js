(function(){
    'use strict';

    angular
        .module('societyPro.sproControllers', ['societyPro.sproServices', 'societyPro.sproFactories', 'uiGmapgoogle-maps'])
        .controller('sproMainCtrl', sproMainCtrl)
        .controller('findSrvcCtrl', findSrvcCtrl)
        .controller('reportSrvcCtrl', reportSrvcCtrl)
        .controller('suggestSrvcCtrl', suggestSrvcCtrl);
    
    sproMainCtrl.$inject = ['$scope', '$rootScope', 'sproRenderMapFactory', 'sproMarkerSvc', 'sproPlaceDraggableMarkerSrvc'];
    findSrvcCtrl.$inject = ['$scope', '$rootScope', 'sproApiCallsSvc', 'sproDrawCircleFactory', 'sproRenderMapFactory', 'sproPlaceDraggableMarkerSrvc'];
    reportSrvcCtrl.$inject = ['$scope', '$rootScope'];
    suggestSrvcCtrl.$inject = [];
    
    function sproMainCtrl($scope, $rootScope, sproRenderMapFactory, sproMarkerSvc, sproPlaceDraggableMarkerSrvc){
        var ctrl = this;
        
        $scope.mapParams = { 
            center: {
                latitude: 18.5, 
                longitude: 73.85 
            }, 
            zoom: 13
        };
        
        
        ctrl.serviceNames = [{ 
                Key: "Gym",
                Value: "gyms"
            }, {
                Key: "Swimming",
                Value: "swimming"
            }, {
                Key: "Coaching",
                Value: "coaching"
            }, {
                Key: "Ground",
                Value: "ground"
            }, {
                Key: "Police Station",
                Value: "policestation"
            }, {
                Key: "Restaurant",
                Value: "restaurant"
            }, {
                Key: "Pub",
                Value: "pub"
            }];
        
        $scope.markerLocation = {
            latitude: 18.5, 
            longitude: 73.85    
        };
        
        $scope.selectedServiceName = null;
        
        $scope.map = sproRenderMapFactory.displayMap($scope.mapParams, 'mapBody');
        
    };
    
    //==============================findSrvcCtrl===================================//
    function findSrvcCtrl($scope, $rootScope, sproApiCallsSvc, sproDrawCircleFactory, sproRenderMapFactory, sproPlaceDraggableMarkerSrvc){    
        var ctrl = this;
        
        ctrl.selectedRadius = null;
        
        ctrl.radius = [{ 
                Key: "1 km",
                Value: 1000
            }, {
                Key: "2 kms",
                Value: 2000
            }, {
                Key: "5 kms",
                Value: 5000
            }, {
                Key: "10 kms",
                Value: 10000
            }, {
                Key: "20 kms",
                Value: 20000
            }, {
                Key: "50 kms",
                Value: 50000
            }, {
                Key: "100 kms",
                Value: 100000
            }];
        
        ctrl.placePickLocationMarker = function() {
            $scope.map = {};
            $scope.map = sproRenderMapFactory.displayMap($scope.mapParams, 'mapBody');
            sproPlaceDraggableMarkerSrvc.placeMarker($scope.markerLocation, 'pickLocationInputBox', $scope.map);
        }
        
        ctrl.placeEnterLocationMarker = function() {
            $scope.map = {};
            $scope.map = sproRenderMapFactory.displayMap($scope.mapParams, 'mapBody');
            //sproPlaceDraggableMarkerSrvc.placeMarker(ctrl.location, 'pickLocationInputBox', $rootScope.map);
        }
        //sproPlaceDraggableMarkerSrvc.placeMarker(ctrl.location, 'pickLocationInputBox', $rootScope.map);
        
        ctrl.submitForm = function(){
            if($scope.markerLocation == '' || $scope.markerLocation == null){
                console.log('Location not selected');
            } else if(! $scope.selectedServiceName){
                console.log('Radius selected = ' + ctrl.selectedRadius);
                console.log('Service = ' + $scope.selectedServiceName);
                console.log('Service not selected');
            } else if(!ctrl.selectedRadius){
                console.log('Radius not selected');
            } else {
                if(ctrl.circle)
                    ctrl.circle.setMap(null);
                console.log("test lat : " + $scope.markerLocation.latitude);
                
                ctrl.circle = sproDrawCircleFactory.drawCircle($scope.markerLocation, ctrl.selectedRadius, $scope.map);
                sproApiCallsSvc.getServiceResults($scope.selectedServiceName, ctrl.circle, $scope.map);    
                }
            };
        
        ctrl.reset = function(){
            //clear markers
        };
        
        $scope.$on('eventFired', function(event, data) {
            ctrl.submitForm();
            //$scope.$apply();
        });
     };
    
    //==============================reportSrvcCtrl===================================//
    function reportSrvcCtrl($scope, $rootScope){
        var ctrl = this;
        
        $scope.selectedServiceName = null;
        
        
        //addDecription();
    };
    
    //==============================suggestSrvcCtrl===================================//
    function suggestSrvcCtrl(){
        var ctrl = this;
        
        ctrl.suggestedSrvc = null;
        ctrl.phone = null;
        ctrl.email = null;
        //ctrl.suggestSrvc = function(){};
        //sproSendMessage.sendMessage();
        //sproSendEmail.sendEmail();
        ctrl.submitForm = function(){
            console.log("Suggested srvice : " + ctrl.suggestedSrvc);
            //ctrl.suggestSrvc();
        };
    };
    
})();
