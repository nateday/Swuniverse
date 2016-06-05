(function () {

	let graph = require('ngraph.graph')();
	let renderGraph = require('ngraph.pixel');

	let linkKeys = {};

	let physics = {
		springLength: 100,
		springCoeff: 0.0002,
		gravity: -0.5,
		theta: 0.2,
		dragCoeff: 0.02
	};

	getJson(function (json) {

		//console.log('Json: ', json);

		json.forEach(function (item) {
			//console.log('Item: ', item);
			graph.addNode(item.id, item);

			mapAffiliations(item, item.affiliations);
			mapFilms(item, item.films);
			mapWeapons(item, item.weapons);
			mapTools(item, item.tools);
		});

		let renderer = renderGraph(graph, {
			physics: physics,
			node: createNodeUI,
			link: createLinkUI
		});
	});

	function mapAffiliations(item, affiliations) {

		if (affiliations) {
			affiliations.forEach(function (affiliationId) {
				if (!isLinkMapped(item.id, affiliationId)) {
					graph.addLink(item.id, affiliationId);
				}
			});
		}
	}

	function mapFilms(item, films) {

		if (films) {
			films.forEach(function (filmId) {
				if (!isLinkMapped(item.id, filmId)) {
					graph.addLink(item.id, filmId);
				}
			});
		}
	}

	function mapWeapons(item, weapons) {

		if (weapons) {
			weapons.forEach(function (weaponId) {
				if (!isLinkMapped(item.id, weaponId)) {
					graph.addLink(item.id, weaponId);
				}
			});
		}
	}

	function mapTools(item, tools) {

		if (tools) {
			tools.forEach(function (toolId) {
				if (!isLinkMapped(item.id, toolId)) {
					graph.addLink(item.id, toolId);
				}
			});
		}
	}

	function mapVehicles(item, tools) {

		if (vehicles) {
			vehicles.forEach(function (vehicleId) {
				if (!isLinkMapped(item.id, vehicleId)) {
					graph.addLink(item.id, vehicleId);
				}
			});
		}
	}

	function mapStarships(item, tools) {

		if (starships) {
			starships.forEach(function (starshipId) {
				if (!isLinkMapped(item.id, starshipId)) {
					graph.addLink(item.id, starshipId);
				}
			});
		}
	}

	function mapSpecies(item, tools) {

		if (species) {
			species.forEach(function (speciesId) {
				if (!isLinkMapped(item.id, speciesId)) {
					graph.addLink(item.id, speciesId);
				}
			});
		}
	}

	function mapDroids(item, tools) {

		if (droids) {
			droids.forEach(function (droidId) {
				if (!isLinkMapped(item.id, droidId)) {
					graph.addLink(item.id, droidId);
				}
			});
		}
	}

	function createNodeUI(node) {
		
		//console.log('Node: ', node);

		let type = node.data ? node.data.type : 'Item';
		let color = getTypeColor(type);

		switch (type) {
			case 'Character':
				return {
					color: color,
					size: 30
				};

			case 'Planet':
				return {
					color: color,
					size: 30
				};

			case 'Film':
				return {
					color: color,
					size: 50
				};

			case 'Weapon':
				return {
					color: color,
					size: 15
				};

			case 'Vehicle':
				return {
					color: color,
					size: 25
				};

			case 'Starship':
				return {
					color: color,
					size: 25
				};

			case 'Tool':
				return {
					color: color,
					size: 15
				};

			case 'Species':
				return {
					color: color,
					size: 15
				};

			case 'Affiliation':
				return {
					color: color,
					size: 15
				};

			default:
				return {
					color: color,
					size: 10
				};
		}
	}

	function createLinkUI(link) {
		
		let fromColor = getTypeColor(link.data.from);
		let toColor = getTypeColor(link.data.to);

		return {
			fromColor: fromColor,
			toColor: toColor
		};
    }

	function getTypeColor(type) {

		switch (type) {
			case 'Film':
				return 0x016280; // Blue

			case 'Character':
				return 0x3E9D33; // Light Green

			case 'Affiliation':
				return 0x1C5423; // Dark Green	

			case 'Sepcies':
				return 0xD0F8AB; // Light Lime	

			case 'Planet':
				return 0xCDB465; // Tan	

			case 'Weapon':
				return 0xA5111A; // Red

			case 'Vehicle':
				return 0xFFFF00; // Yellow

			case 'Starship':
				return 0x9900CC; // Purple

			case 'Tool':
				return 0x663300 // Brown	

			default:
				return 0xEBA071; // Salmon
		}
	}
	
	function isLinkMapped(idA, idB) {

		let key = idA < idB ? idA + '-' + idB : idB + '-' + idA;

		if (linkKeys[key]) {
			return true;
		}
		else {
			linkKeys[key] = true;
			return false;
		}
	}

	function getJson(done) {

		let httpRequest = new XMLHttpRequest();

		httpRequest.addEventListener('load', function () {
			done(JSON.parse(httpRequest.responseText));
		});

		httpRequest.open('GET', '/data.json');
		httpRequest.send();
	}
})();