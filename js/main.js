let restaurants,
    neighborhoods,
    cuisines;
var newMap;
var markers = [];





var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
     mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
            
var mbAttr2='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
var mbUr2='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr});
var  satalite  = L.tileLayer(mbUr2, {id: 'mapbox.satalite',   attribution: mbAttr2});
var  streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});
                

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {

  // if ('serviceWorker' in navigator) {
  //   navigator.serviceWorker
  //     .register('./sw.js')
  //     .then( (registration) => {
  //       // Registration was successful
  //       console.log('ServiceWorker registered, scope: ', registration.scope);
  //     })
  //     .catch( (error) => {
  //       // registration failed
  //       console.log('ServiceWorker registration failed: ', error);
  //     });

  // }


  initMap(); // added
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
        center: [30.4891382,31.3587897],
        zoom: 7.5,
        scrollWheelZoom: true,
        layers: [grayscale,satalite,streets],
        fullscreenControl: true,
          fullscreenControlOptions:{
                position: 'topleft'
            },
        mapboxToken: 'pk.eyJ1IjoibW9zdGFmYWFpb3VwIiwiYSI6ImNqenoxZ203YTF0NTgzbm1qZG5nbXd3OXAifQ.9SdYXaCabPwO25xyAYKByA'
      });

  
  var baseLayers = {
    "Grayscale": grayscale,
    "satalite":satalite,
    "Streets": streets
    
    };
L.control.layers(baseLayers).addTo(newMap);
updateRestaurants();
document.getElementById('map').tabIndex = '-1';
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  li.setAttribute('style',`display:${restaurant.display}`);
  // li.setAttribute('class',`${restaurant.display}`);
  const link = document.createElement('a');
  // link.innerHTML = 'View Details';
  link.href = DBHelper.urlForRestaurant(restaurant);
  link.className = restaurant.cuisine_type.toLowerCase();
  link.setAttribute('aria-label', 'Details of ' + restaurant.name + ' restaurant, ' + restaurant.neighborhood);
  link.tabIndex = '0';
  li.append(link);

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = restaurant.photograph;
  image.alt = 'Image of ' + restaurant.name + ' restaurant';
  link.append(image);

  const label = document.createElement('div');
  label.className = 'restaurant-label';
  link.append(label);

  const name = document.createElement('h1');
  name.className = 'restaurant-name';
  name.innerHTML = restaurant.name;
  label.append(name);

  const linehr = document.createElement('hr');
  label.append(linehr);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  label.append(neighborhood);

  const address = document.createElement('p');
  address.className = 'restaurant-address';
  address.innerHTML = restaurant.address;
  label.append(address);

  const hr = document.createElement('hr');
  label.append(hr);

  const rating = document.createElement('span');
  rating.className = 'rating';
  rating.innerHTML = 'Rating: ' + restaurantRating(restaurant); //'rating';
  label.append(rating);

  const type = document.createElement('span');
  type.className = 'cuisine-type';
  type.innerHTML = restaurant.cuisine_type;
  label.append(type);

  return li;
};

restaurantRating = (restaurant) => {
  let reviews = restaurant.reviews.map( (r) => r.rating);
  let rating = reviews.reduce((a, b) => a + b, 0) / reviews.length;
  rating = rating.toFixed(1);

  return rating;
};

var x=1;

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  
  restaurants.forEach(restaurant => {
    if(restaurant.display != "none"){
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.bindPopup(`<b id="popupname">${restaurant.name}</b><br><img id="popupimg" src="${restaurant.photograph}" width="150" height="100" alt="${restaurant.name}"><br><a href="restaurant.html?id=${restaurant.id}"><button id="popuplink">Go Visit</button></a>`).openPopup();
    self.markers.push(marker);
  }
  });
}
console.log(markers);



////////////////////////////////////////////////////////////////////////////////////


