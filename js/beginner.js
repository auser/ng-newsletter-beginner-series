var app = angular.module('myApp', []);

app.controller('PlayerController', ['$scope', function($scope) {
  var audio = document.createElement('audio');
  $scope.audio = audio;

  audio.src = 'http://pd.npr.org/npr-mp4/npr/sf/2013/07/20130726_sf_05.mp4?orgId=1&topicId=1032&ft=3&f=61';
  audio.play();
}]);

app.controller('RelatedController', ['$scope', function($scope) {
}]);