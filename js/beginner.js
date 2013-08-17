var app = angular.module('myApp', []),
    apiKey = 'MDExODQ2OTg4MDEzNzQ5OTM4Nzg5MzFiZA001',
    nprUrl = 'http://api.npr.org/query?id=61&fields=relatedLink,title,byline,text,audio,image,pullQuote,all&output=JSON';


app.factory('audio', ['$document', function($document) {
  var audio = $document[0].createElement('audio');
  return audio;
}]);

app.factory('player', ['audio', '$rootScope', function(audio, $rootScope) {
  var player = {

    current: null,
    progress: 0,
    playing: false,

    play: function(program) {
      if (player.playing) 
        player.stop();

      var url = program.audio[0].format.mp4.$text;
      player.current = program;
      audio.src = url;
      audio.play();
      player.playing = true;
    },
    stop: function() {
      if (player.playing) {
        audio.pause();
        player.playing = false;
        player.current = null;
      }
    },
    currentTime: function() {
      return audio.currentTime;
    }
  };

  audio.addEventListener('ended', function() {
    $rootScope.$apply(player.stop());
  });
  return player;
}]);

app.factory('nprService', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
    var doRequest = function(apiKey) {
      var d = $q.defer();
      $http({
        method: 'JSONP',
        url: nprUrl + '&apiKey=' + apiKey + '&callback=JSON_CALLBACK'
      }).success(function(data, status, headers) {
        d.resolve(data.list.story);
      }).error(function(data, status, headers) {
        d.reject(status, data);
      });

      return d.promise;
    }

    return {
      programs: function(apiKey) { return doRequest(apiKey); }
    };
  }]);

app.directive('nprLink', function() {
  return {
    restrict: 'EA',
    require: ['^ngModel'],
    replace: true,
    scope: {
      ngModel: '=',
      player: '='
    },
    templateUrl: 'views/nprListItem.html',
    link: function(scope, ele, attr) {
      scope.duration = scope.ngModel.audio[0].duration.$text;
    }
  }
});

app.controller('PlayerController', ['$scope', 'nprService', 'player', function($scope, nprService, player) {
  $scope.player = player;
  $scope.programs = nprService.programs(apiKey);
}]);

app.controller('RelatedController', ['$scope', 'player', function($scope, player) {
  $scope.player = player;
  
  $scope.$watch('player.current', function(newVal) {
    if (newVal) {
      $scope.related = [];
      angular.forEach(newVal.relatedLink, function(link) {
        $scope.related.push({link: link.link[0].$text, caption: link.caption.$text});
      });
    }
  });
}]);

// Parent scope
app.controller('FrameController', ['$scope', function($scope) {

}]);