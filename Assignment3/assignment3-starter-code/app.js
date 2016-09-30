(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com')
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective(){
  var ddo = {
    templateURL: 'foundItemsTemplate.html',
    scope: {
      Items: "<",
      onRemove: '&'
    },

    controller: FoundItemsDirectiveController,
    controllerAs: 'FIDClist',
    bindToController: true,
    link: FoundItemsDirectiveLink
  }
  return ddo
}

function FoundItemsDirectiveController() {
  var list = this;

  list.isEmpty = function() {
    return (list.items == 'undefinded' || list.items.length === 0);
  }
}

function FoundItemsDirectiveLink(scope, element, attribute, controller) {
  scope.$watch('list.isEmpty()', function(newValue, oldValue){
    if(newValue === true) {
      displayNoResultsMessage();
    } else {
      hideNoResultsMessage();
    }
  });

  function displayNoResultsMessage() {
    var messageElement = element.find("span.error");
    messageElement.slideDown(900);
  }

  function hideNoResultsMessage() {
    var messageElement = element.find("span.error");
    messageElement.slideUp(900);
  }

}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuCategoriesService) {
  var list = this;

  list.itemName = "";
  list.items = [];

  list.found = function () {
    MenuSearchService.getMatchedMenuItems(list.itemName)
      .then(function(response) {
        list.items = response.items;
      } )
    // var promise = MenuSearchService.getMatchedMenuItems(list.itemName);
    // promise.then(function (response) {
    //   list.items = response.data;
    // })
    .catch(function (error) {
      console.log(error);
    })
  };

  list.removeItem = function(itemIndex) {
    list.items.splice(itemIndex, 1)
  }

}


MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath, $q) {
  var service = this;
  service.foundItems = []
  service.getMatchedMenuItems = function (searchTerm) {
    // var foundItems = [];
    // var deferred = $q.defer();
    // //get all menu items off the bat
    // var response = $http({
    //   method: "GET",
    //   url: (ApiBasePath + "/menu_items.json"),
    // });
    // // check for search items
    // response.success(function(data) {
    //   for (var i = 0; i < data.menu_items.length; i++) {
    //     //var descr = data.menu_items[i].description;      
    //     if (data.menu_items[i].description.toLowerCase().indexOf(searchTerm).toLowerCase() !== -1) {
    //       foundItems.push(item)
    //     }
    //   }
    $http({
        method: "GET",
        url: (ApiServerUrl + "/menu_items.json")
      })
      .success(function (data) {
        var fetchedItems = data.menu_items;
        var f_items = [];
          for(var i = 0; i < fetchedItems.length; i++) {
            var description = fetchedItems[i].description;
            var position = description.toLowerCase().indexOf(searchTerm.toLowerCase());
            if ( position !== -1) {
              f_items.push(fetchedItems[i]);
            }
          }
          console.log(f_items)
      deferred.resolve({
        "foundItems" : f_items
      })
    })
    .error(function(msg, code) {
        deferred.reject(msg);
    });
    return deferred.promise;
  };
}

})();
