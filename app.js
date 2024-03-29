(function() {
	'use strict';

	angular
		.module("NarrowItDownApp", [])
		.controller('NarrowItDownController', NarrowItDownController)
		.service('MenuSearchService', MenuSearchService)
		.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
		.directive('foundItems', FoundItemsDirective);

		function FoundItemsDirective() {
			var ddo = {
				restrict: 'E',
				templateUrl: 'foundItems.html',
				scope: {
					foundItem: '<',
					onRemove: '&',
					onEmpty: '<'
				}
			};
			return ddo;
		}

		NarrowItDownController.$inject = ['MenuSearchService'];
		 function NarrowItDownController(MenuSearchService) {
		 	var choices = this;
		 	choices.searchTerm = "";

		 	// choices.empty = "";

		 	choices.getMatchedMenuItems = function (){
		 		if (choices.searchTerm === "") {
		 			choices.empty = true;

		 		}else {
		 			var promise = MenuSearchService.getMatchedMenuItems(choices.searchTerm);
		 			console.log(choices.searchTerm);
		 			promise.then(function(response){
		 			if (response.length === 0) {
		 				choices.empty = true;	
		 			}else{
		 				choices.empty = false;
		 				choices.found = response;	
		 			}	
		 			console.log(choices.empty);
		 		})
		 		.catch(function(error){
		 			console.log(error);
		 		});	

		 		}
	 			

		 	};

		 	choices.removeItem = function (index){
				choices.found.splice(index, 1);
			};
		 }

		MenuSearchService.$inject = ['$http', 'ApiBasePath']
		function MenuSearchService($http, ApiBasePath) {
			var service = this;

			service.getMatchedMenuItems = function (searchTerm) {
				return $http({
					method: "GET",
					url: (ApiBasePath + "/menu_items.json")
				}).then(function (result) {
					var menu_items = result.data["menu_items"];
					var foundItems = [];

					menu_items.forEach(function(item){
						
						var searchResult = item.description.toLowerCase().
							search(searchTerm);

						if (searchResult !== -1) {
							foundItems.push({name: item.name, short_name: item.short_name,
							 description: item.description});
						}

					});
					return foundItems
					}).catch(function (error) {
                		console.log("get request failed");
				});

			};
			
		} 
})();