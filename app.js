(function () {

	let graph = require('ngraph.graph')();
	let renderGraph = require('ngraph.pixel');
	let _ = require('lodash');
	let plate = require('plate');
	let flyTo = require('ngraph.pixel/lib/flyTo');

	let swSata = {};
	let itemNames = {};
	let linkKeys = {};
	let legendOpen = false;
	let feedbackOpen = false;

	let physics = {
		springLength: 100,
		springCoeff: 0.0001,
		gravity: -0.5,
		theta: 0.2,
		dragCoeff: 0.02
	};

	$.get('/data.json', function(json) {

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
			clearAlpha: 0.0,
			container: document.getElementById('graph'),
			physics: physics,
			node: createNodeUI,
			link: createLinkUI
		});

		let showNode = function(nodeId, stopDistance) {

			startDistance = 500;
			stopDistance = typeof stopDistance === 'number' ? stopDistance : 100;

			var self = this;

			var interval = setInterval(function() {

				flyTo(self.camera(), self.layout().getNodePosition(nodeId), startDistance);
				startDistance -= 10;

				if(startDistance < stopDistance) {
					clearInterval(interval);
				}
			}, 1);
		}

		renderer.showNode = showNode.bind(renderer);

		//console.log('Graph: ', renderer);

		renderer.on('nodeclick', function (node) {
			console.log(node);	

			// let source = $('#infoTemplate').text();
			// let template = new plate.Template(source);

			closeFeedbackCard();
			closeLegendCard();
			
			let template = getTypeTemplate(node.data.type);

			renderer.showNode(node.id, 30);

			node.data.typeClass = getTypeClass(node.data.type);

			node.data.boxColor = getBoxColor(node.data.type);

			node.data.boltColor = getBoltColor(node.data.type);

			template.render(node.data, function (err, html) {

				let info = $('#info');

				info.html(html);
			});
		});

	});

    
    $('body').on('click', '#hide-card', function(){
        closeCard();
    });

    $('#feedbackButton').on('click', function() {

		if (feedbackOpen) {
			closeFeedbackCard();
			feedbackOpen = !feedbackOpen;
		}
		else {

			var source = $('#feedbackTemplate').text();
			var template = new plate.Template(source);

			closeCard();
			closeLegendCard();

			template.render({}, function (err, html) {

				$('#feedback').html(html);
			});
			feedbackOpen = !feedbackOpen;
		}        
    });

	$('#legendButton').on('click', function() {

		if(legendOpen) {
			closeLegendCard();
			legendOpen = !legendOpen;
		}
		else {
			var source = $('#legendTemplate').text();
			var template = new plate.Template(source);

			closeCard();
			closeFeedbackCard();

			template.render({}, function (err, html) {

				$('#legend').html(html);
			});
			legendOpen = !legendOpen;
		}
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
				return 0x663300; // Brown	

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

	function getTypeClass(type) {

		switch (type) {
			case 'Film':
				return 'node-blue'; // Blue

			case 'Character':
				return 'node-light-green'; // Light Green

			case 'Organization':
				return 'node-dark-green'; // Dark Green	

			case 'Species':
				return 'node-light-lime'; // Light Lime	

			case 'Location':
				return 'node-brown'; // Brown	

			case 'Technology':
				return 'node-red'; // Red

			case 'Vehicle':
				return 'node-yellow'; // Yellow

			case 'Creature':
				return 'node-purple'; // Purple

			case 'Droid':
				return 'node-orange'; // Orange		

			 default:
			 	return 'node-salmon'; // Salmon
		}

	}

	function getBoxColor(type) {

		switch (type) {
			case 'Film':
				return 'box-blue box-blue:hover glow-blue'; // Blue

			case 'Character':
				return 'box-light-green box-light-green:hover glow-light-green'; // Light Green

			case 'Organization':
				return 'box-dark-green box-dark-green:hover glow-dark-green'; // Dark Green	

			case 'Species':
				return 'box-light-lime box-light-lime:hover glow-light-lime'; // Light Lime	

			case 'Location':
				return 'box-brown box-brown:hover glow-brown'; // Brown	

			case 'Technology':
				return 'box-red box-red:hover glow-red'; // Red

			case 'Vehicle':
				return 'box-yellow box-yellow:hover glow-yellow'; // Yellow

			case 'Creature':
				return 'box-purple box-purple:hover glow-purple'; // Purple

			case 'Droid':
				return 'box-orange box-orange:hover glow-orange'; // Orange		

			 default:
			 	return 'box-salmon box-salmon:hover glow-salmon'; // Salmon
		}

	}

	function getBoltColor(type) {

		switch (type) {
			case 'Film':
				return 'bolt-blue';

			case 'Character':
				return 'bolt-light-green';

			case 'Organization':
				return 'bolt-dark-green';

			case 'Species':
				return 'bolt-light-lime';

			case 'Location':
				return 'bolt-brown';
			
			case 'Technology':
				return 'bolt-red';

			case 'Vehicle':
				return 'bolt-yellow';

			case 'Creature':
				return 'bolt-purple';

			case 'Droid':
				return 'bolt-orange';

			default:
				return 'bolt-salmon';
		}

	}

	function getTypeTemplate (type) {

		let source = null;
		let template = null;

		switch (type) {
			case 'Film' || 'Organization':
				source = $('#infoFilmOrgTemplate').text();
				template = new plate.Template(source);
				return template;
			
			case 'Character':
				source = $('#infoCharacterTemplate').text();
				template = new plate.Template(source);
				return template;

			case 'Location':
				source = $('#infoLocationTemplate').text();
				template = new plate.Template(source);
				return template;

			default:
				source = $('#infoTemplate').text();
				template = new plate.Template(source);
				return template;
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

	function closeCard() {

		var card = $("#card") 
        card.removeClass('bounceInRight');
        card.addClass('bounceOutRight');
        setTimeout(function(){
            card.hide();
            card.addClass('bounceInRight');
            card.removeClass('bounceOutRight');
        }, 700);

	}

	function closeFeedbackCard() {

		var feedback = $('#feedbackCard');

        feedback.removeClass('bounceInRight');
        feedback.addClass('bounceOutRight');
        setTimeout(function() {

            feedback.hide();
            feedback.addClass('bounceInRight');
            feedback.removeClass('bounceOutRight');

        }, 700);

	}

	function closeLegendCard() {

		var legend = $('#legendCard');

		legend.removeClass('bounceInLeft');
		legend.addClass('bounceOutLeft');
		setTimeout(function () {

			legend.hide();
			legend.addClass('bounceInLeft');
			legend.removeClass('bounceOutLeft');

		}, 700);

	}

})();