let restaurant;
var newMap;

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
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map('map', {
            center: [restaurant.latlng.lat, restaurant.latlng.lng],
            zoom: 16,
            scrollWheelZoom: true , //false,
            layers: [grayscale,satalite,streets],
            mapboxToken: 'pk.eyJ1IjoibW9zdGFmYWFpb3VwIiwiYSI6ImNqenoxZ203YTF0NTgzbm1qZG5nbXd3OXAifQ.9SdYXaCabPwO25xyAYKByA'
          });
          var baseLayers = {
            "Grayscale": grayscale,
            "satalite":satalite,
            "Streets": streets
            
          };
      
          
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
      L.control.layers(baseLayers).addTo(newMap);
    }
    
  });
  
};

fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  name.classList.add(restaurant.cuisine_type.toLowerCase() + '-color');

  const rating = document.querySelector('.rating');
  rating.innerHTML = 'Rating: ' + restaurantRating(restaurant); //'rating';
  rating.classList.add(restaurant.cuisine_type.toLowerCase());

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.style.backgroundImage = `url('${restaurant.photograph}')`;
  image.setAttribute('aria-label', 'Image ' + restaurant.name + ' restaurant, ');
  image.setAttribute('alt', 'Image ' + restaurant.name + ' restaurant, ');
  // image.tabIndex = '2';
  const location = document.getElementById('restaurant-location');
  location.innerHTML = restaurant.neighborhood;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.setAttribute('aria-label', 'Address: ' + restaurant.address + ', ' + restaurant.neighborhood);



  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
  cuisine.classList.add(restaurant.cuisine_type.toLowerCase());
  cuisine.setAttribute('aria-label', 'Cuisine type: ' + restaurant.cuisine_type);

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

restaurantRating = (restaurant) => {
  let reviews = restaurant.reviews.map( (r) => r.rating);
  let rating = reviews.reduce((a, b) => a + b, 0) / reviews.length;
  rating = rating.toFixed(1);

  return rating;
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.querySelector('#reviews-container div');

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');

  const heading = document.createElement('div');
  heading.className = 'review-heading';
  li.appendChild(heading);


  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.className = 'name';
  heading.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = review.date;
  date.className = 'date';
  heading.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.className = 'rating';
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.className = 'comment';
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
