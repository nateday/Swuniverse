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

			mapAffiliations(item, item.affiliations);
			mapFilms(item, item.films);
			mapWeapons(item, item.weapons);
			mapTools(item, item.tools);
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

	function mapAffiliations(item, affiliations) {

		if (affiliations) {
			affiliations.forEach(function (affiliationId) {
				if (!isLinkMapped(item.id, affiliationId)) {

					let itemName = getItemName(item.id);
					let affiliationName = getItemName(affiliationId);

					graph.addLink(itemName, affiliationName, { from: item.type, to: 'Affiliation' });
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

	function mapWeapons(item, weapons) {

		if (weapons) {
			weapons.forEach(function (weaponId) {
				if (!isLinkMapped(item.id, weaponId)) {

					let itemName = getItemName(item.id);
					let weaponName = getItemName(weaponId);

					graph.addLink(itemName, weaponName, { from: item.type, to: 'Weapon' });
				}
			});
		}
	}

	function mapTools(item, tools) {

		if (tools) {
			tools.forEach(function (toolId) {
				if (!isLinkMapped(item.id, toolId)) {

					let itemName = getItemName(item.id);
					let toolName = getItemName(toolId);

					graph.addLink(itemName, toolName, { from: item.type, to: 'Tool' });
				}
			});
		}
	}

	function mapVehicles(item, tools) {

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

	function mapStarships(item, tools) {

		if (starships) {
			starships.forEach(function (starshipId) {
				if (!isLinkMapped(item.id, starshipId)) {

					let itemName = getItemName(item.id);
					let starshipName = getItemName(starshipId);

					graph.addLink(itemName, starshipName, { from: item.type, to: 'Starship' });
				}
			});
		}
	}

	function mapSpecies(item, tools) {

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

	function mapDroids(item, tools) {

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

			case 'Affiliation':
				return 0x1C5423; // Dark Green	

			case 'Species':
				return 0xD0F8AB; // Light Lime	

			case 'Planet':
				return 0xCDB465; // Tan	

			case 'Weapon':
				return 0xC9302C; // Red

			case 'Vehicle':
				return 0xFFFF00; // Yellow

			case 'Starship':
				return 0x8d23a3; // Purple

			case 'Tool':
				return 0x663300 // Brown

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