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
					found: '<',
					onRemove: '&',
					empty: '<'
				}
				// controller: NarrowItDownController, 
				controllerAs: 'choices',
				bindToController: true

			};

			return ddo;
		}

		// function FoundItemsDirectiveController() {
		// 	var choices = this;
		// }

		NarrowItDownController.$inject = ['MenuSearchService'];
		 function NarrowItDownController(MenuSearchService) {
		 	var choices = this;
		 	choices.searchTerm = "";
		 	choices.empty = false;
		 	// var found_items = [];
		 	// choices.found = getItems();

		 	choices.getMatchedMenuItems = function (){
		 		if (choices.searchTerm === ""){
		 			choices.empty = true;
		 		} else {
			 		var promise = MenuSearchService.getMatchedMenuItems(choices.searchTerm);
			 		console.log(choices.searchTerm);
			 		promise.then(function(response){
			 			choices.found = response;
			 			console.log(choices.found);
			 			console.log(choices.empty);	
			 		})
			 		.catch(function(error){
			 			console.log(error);
			 		});
		 		}	

		 	};

		 	// var getItems = function () {
		 	// 	return found_items;
		 	// };

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