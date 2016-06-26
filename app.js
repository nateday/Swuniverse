(function () {

	let graph = require('ngraph.graph')();
	let renderGraph = require('ngraph.pixel');
	let _ = require('lodash');
	let plate = require('plate');

	let swSata = {};
	let itemNames = {};
	let linkKeys = {};

	let physics = {
		springLength: 100,
		springCoeff: 0.0001,
		gravity: -0.5,
		theta: 0.2,
		dragCoeff: 0.02
	};

	getJson(function (json) {

		swData = json;

		//console.log('Json: ', json);

		json.forEach(function (item) {
			//console.log('Item: ', item);
			graph.addNode(getItemName(item.id), item);

			mapOrganizations(item, item.organizations);
			mapFilms(item, item.films);
			mapTechnology(item, item.technology);
			mapCharacters(item, item.characters);
			mapDroids(item, item.droids);
			mapCreatures(item, item.creatures);
			mapLocations(item, item.locations);
			mapSpecies(item, item.species);
			mapVehicles(item, item.vehicles);
			
		});

		let renderer = renderGraph(graph, {
			container: document.getElementById('graph'),
			physics: physics,
			node: createNodeUI,
			link: createLinkUI
		});

		renderer.on('nodeclick', function (node) {
			console.log(node);	
			let source = $('#infoTemplate').text();
			let template = new plate.Template(source);

			renderer.showNode(node.id, 30);

			template.render(node.data, function (err, html) {

				let info = $('#info');

				info.html(html);
			});
		});
	});

	function mapOrganizations(item, organization) {

		if (organization) {
			organization.forEach(function (organizationId) {
				if (!isLinkMapped(item.id, organizationId)) {

					let itemName = getItemName(item.id);
					let organizationName = getItemName(organizationId);

					graph.addLink(itemName, organizationName, { from: item.type, to: 'Organization' });
				}
			});
		}
	}

	function mapLocations(item, locations) {

		if (locations) {
			locations.forEach(function (locationId) {
				if (!isLinkMapped(item.id, locationId)) {

					let itemName = getItemName(item.id);
					let locationName = getItemName(locationId);

					graph.addLink(itemName, locationName, { from: item.type, to: 'Location' });
				}
			});
		}
	}

	function mapFilms(item, films) {

		if (films) {
			films.forEach(function (filmId) {
				if (!isLinkMapped(item.id, filmId)) {

					let itemName = getItemName(item.id);
					let filmName = getItemName(filmId);

					graph.addLink(itemName, filmName, { from: item.type, to: 'Film' });
				}
			});
		}
	}

	function mapTechnology(item, technology) {

		if (technology) {
			technology.forEach(function (technologyId) {
				if (!isLinkMapped(item.id, technologyId)) {

					let itemName = getItemName(item.id);
					let technologyName = getItemName(technologyId);

					graph.addLink(itemName, technologyName, { from: item.type, to: 'Technology' });
				}
			});
		}
	}

	function mapCharacters(item, characters) {

		if (characters) {
			characters.forEach(function (characterId) {
				if (!isLinkMapped(item.id, characterId)) {

					let itemName = getItemName(item.id);
					let characterName = getItemName(characterId);

					graph.addLink(itemName, characterName, { from: item.type, to: 'Character' });
				}
			});
		}
	}

	function mapCreatures(item, creatures) {

		if (creatures) {
			creatures.forEach(function (creatureId) {
				if (!isLinkMapped(item.id, creatureId)) {

					let itemName = getItemName(item.id);
					let creatureName = getItemName(creatureId);

					graph.addLink(itemName, creatureName, { from: item.type, to: 'Creature' });
				}
			});
		}
	}

	function mapVehicles(item, vehicles) {

		if (vehicles) {
			vehicles.forEach(function (vehicleId) {
				if (!isLinkMapped(item.id, vehicleId)) {

					let itemName = getItemName(item.id);
					let vehicleName = getItemName(vehicleId);

					graph.addLink(itemName, vehicleName, { from: item.type, to: 'Vehicle' });
				}
			});
		}
	}

	function mapSpecies(item, species) {

		if (species) {
			species.forEach(function (speciesId) {
				if (!isLinkMapped(item.id, speciesId)) {

					let itemName = getItemName(item.id);
					let speciesName = getItemName(speciesId);

					graph.addLink(itemName, speciesName, { from: item.type, to: 'Species' });
				}
			});
		}
	}

	function mapDroids(item, droids) {

		if (droids) {
			droids.forEach(function (droidId) {
				if (!isLinkMapped(item.id, droidId)) {

					let itemName = getItemName(item.id);
					let droidName = getItemName(droidId);

					graph.addLink(itemName, droidName, { from: item.type, to: 'Droid' });
				}
			});
		}
	}

	function getItemName(itemId) {

		if (itemNames[itemId]) {
			return itemNames[itemId];
		}
		else {
			let swItem = _.find(swData, function (item) {
				return item.id === itemId;
			})

			if (swItem) {
				itemNames[itemId] = swItem.name || swItem.id;
			}
			else {
				itemNames[itemId] = itemId;
			}

			return itemNames[itemId];
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

			case 'Location':
				return {
					color: color,
					size: 30
				};

			case 'Film':
				return {
					color: color,
					size: 50
				};

			case 'Technology':
				return {
					color: color,
					size: 15
				};

			case 'Vehicle':
				return {
					color: color,
					size: 25
				};

			case 'Creature':
				return {
					color: color,
					size: 25
				};

			case 'Species':
				return {
					color: color,
					size: 15
				};

			case 'Organization':
				return {
					color: color,
					size: 15
				};

			case 'Droid':
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
				return 0x286090; // Blue

			case 'Character':
				return 0x3E9D33; // Light Green

			case 'Organization':
				return 0x1C5423; // Dark Green	

			case 'Species':
				return 0xD0F8AB; // Light Lime	

			case 'Location':
				return 0xCDB465; // Tan	

			case 'Technology':
				return 0xC9302C; // Red

			case 'Vehicle':
				return 0xFFFF00; // Yellow

			case 'Creature':
				return 0x8d23a3; // Purple

			case 'Droid':
				return 0xFFA500 // Orange		

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