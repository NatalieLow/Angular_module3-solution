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
				// restrict: 'E',
				templateUrl: 'foundItems.html',
				scope: {
					found: '<',
					onRemove: '&'
				},
				controller: FoundItemsDirectiveController, 
				controllerAs: 'choices',
				bindToController: true

			};

			return ddo
		}

		function FoundItemsDirectiveController() {
			var choices = this;
		}

		NarrowItDownController.$inject = ['MenuSearchService'];
		 function NarrowItDownController(MenuSearchService) {
		 	var choices = this;
		 	choices.searchTerm = "";
		 	choices.found = [];
		 	
		 	// choices.getMatchedMenuItems = function () {
		 	// 	choices.found = MenuSearchService.getMatchedMenuItems(choices.searchTerm);
		 	// 	console.log(choices.searchTerm);
		 	// 	console.log(choices.found);
		 	// };
		 	choices.getMatchedMenuItems = function () {
		 		var promise = MenuSearchService.getMatchedMenuItems(choices.searchTerm);
		 		promise.then(function(response){
		 			choices.found = response;
		 			console.log(choices.searchTerm);
		 			console.log(choices.found);
		 		});
		 		
		 		
		 	};
		 	
		 	 // console.log(searchTerm);

		 	 	// var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
		 	 	// choices.found = [];
		 	 	// promise.then(function(response){
		 	 	// 	choices.found = response;
		 	 	// 	console.log(choices.found)
		 	 	// })
		 		// console.log(choices.found);
		 	// };

		 	
		 	// choices.removeItem = function (itemIndex){
		 	// 	MenuSearchService.removeItem(itemIndex);
		 	// };

		 }

		MenuSearchService.$inject = ['$http', 'ApiBasePath']
		function MenuSearchService($http, ApiBasePath) {
			var service = this;
			// var choices = this;

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

						//  .log(foundItems);

						if (searchResult !== -1) {
							foundItems.push({name: item.name, short_name: item.short_name,
							 description: item.description});
						}

					});
					// console.log(foundItems);
					return foundItems
					}).catch(function (error) {
                		console.log("get request failed");
				});

			};
			// service.removeItem = function (index) {
			// 	found.splice(index, 1);
			// }
		} 
})();